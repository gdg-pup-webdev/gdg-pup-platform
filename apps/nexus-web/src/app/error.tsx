'use client';

import { useEffect } from 'react';
import { SparkmatesBrandedErrorScreen } from '@/features/sparkmates/components/SparkmatesBrandedErrorScreen';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <SparkmatesBrandedErrorScreen
      title="Something went wrong!"
      message="We hit an unexpected issue while loading this page. Please try again."
      onAction={reset}
      buttonLabel="Try again"
    />
  );
}
