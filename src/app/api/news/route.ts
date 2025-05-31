import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const response = await fetch(
      'https://finnhub.io/api/v1/news?category=general&token=d0sreihr01qid5qauj8gd0sreihr01qid5qauj90',
      {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'MyBitFinance/1.0.0'
        },
        next: { revalidate: 3600 } // Cache for 1 hour
      }
    );

    if (!response.ok) {
      throw new Error(`Finnhub API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: 'Failed to fetch market news' },
      { status: 500 }
    );
  }
}