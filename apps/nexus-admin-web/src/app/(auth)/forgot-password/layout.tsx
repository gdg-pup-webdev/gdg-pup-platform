import { RequireUnauthenticated } from '@/features/authentication/components/RequireUnauthenticated'
import React from 'react'

const ForgotPasswordLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <RequireUnauthenticated>
      <div className="min-h-screen w-full flex items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-950">
        {children}
      </div>
    </RequireUnauthenticated>
  )
}

export default ForgotPasswordLayout
