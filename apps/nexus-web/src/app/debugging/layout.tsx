import { redirect } from 'next/navigation';

export default function DebuggingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Prevent access to debugging tools in production
  if (process.env.NODE_ENV === 'production') {
    redirect('/');
  }
  
  return <>{children}</>;
}
