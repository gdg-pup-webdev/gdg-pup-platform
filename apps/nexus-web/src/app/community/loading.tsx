import { Container, Stack } from '@packages/spark-ui';

export default function Loading() {
  return (
    <Container className="py-12">
      <Stack align="center" gap="lg">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="text-gray-600">Loading community...</p>
      </Stack>
    </Container>
  );
}
