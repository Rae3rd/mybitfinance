'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DepositRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard/wallet');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-navy-900">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Redirecting...</h1>
        <p className="text-gray-400">Please wait while we redirect you to the deposit page.</p>
        <div className="mt-4">
          <div className="w-16 h-16 border-t-4 border-emerald-500 border-solid rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    </div>
  );
}