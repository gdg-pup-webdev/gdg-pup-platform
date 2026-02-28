import { TeamSection } from "@/features/about";

export default function TeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <TeamSection>{children}</TeamSection>;
}
