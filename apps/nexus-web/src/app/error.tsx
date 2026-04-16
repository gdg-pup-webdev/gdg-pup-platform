'use client';

import { SparkmatesBrandedErrorScreen } from '@/features/sparkmates/components/SparkmatesBrandedErrorScreen';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <SparkmatesBrandedErrorScreen
      title="Something went wrong!"
      message={error.message}
      onAction={reset}
      buttonLabel="Try again"
    />
  );
}
