import { NextResponse } from 'next/server';
import { Webhook } from 'svix';
import prisma from '@/lib/prisma';

type WebhookPayload = {
  id: string;
  [key: string]: any;
};

type WebhookEvent = {
  data: WebhookPayload;
  type: string;
  object: string;
};

export async function POST(req: Request) {
  // Get the Clerk webhook secret
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  
  if (!webhookSecret) {
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }

  // Get the headers
  const svix_id = req.headers.get('svix-id');
  const svix_timestamp = req.headers.get('svix-timestamp');
  const svix_signature = req.headers.get('svix-signature');

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json({ error: 'Missing svix headers' }, { status: 400 });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret
  const wh = new Webhook(webhookSecret);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return NextResponse.json({ error: 'Error verifying webhook' }, { status: 400 });
  }

  // Handle the webhook
  const { type } = evt;
  const data = evt.data as WebhookPayload;

  // Handle user creation
  if (type === 'user.created') {
    await prisma.user.create({
      data: {
        clerk_id: data.id,
      },
    });
  }

  // Handle user deletion
  if (type === 'user.deleted') {
    const user = await prisma.user.findUnique({
      where: { clerk_id: data.id },
    });

    if (user) {
      await prisma.user.delete({
        where: { id: user.id },
      });
    }
  }

  return NextResponse.json({ success: true });
}