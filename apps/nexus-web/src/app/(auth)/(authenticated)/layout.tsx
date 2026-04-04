import { RequireAuthenticated } from '@/features/authentication/components/RequireAuthenticated'
import { RequireUnauthenticated } from '@/features/authentication/components/RequireUnauthenticated'
import React from 'react'

const layout = ({children } : {children: React.ReactNode}) => {
  return (
    <RequireAuthenticated>
        {children}
    </RequireAuthenticated>
  )
}

export default layout