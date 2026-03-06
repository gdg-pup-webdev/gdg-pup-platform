'use client';

import { Button, Container, Stack } from '@packages/spark-ui';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Container className="py-12">
      <Stack align="center" gap="lg" className="text-center">
        <div className="text-6xl">⚠️</div>
        <h2 className="text-2xl font-bold text-red-600">Something went wrong!</h2>
        <p className="text-gray-600 max-w-md">{error.message}</p>
        <Button variant="default" onClick={reset}>Try again</Button>
      </Stack>
    </Container>
  );
}
