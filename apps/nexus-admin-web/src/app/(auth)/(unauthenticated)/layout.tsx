import { RequireUnauthenticated } from '@/features/authentication/components/RequireUnauthenticated'
import React from 'react'

const layout = ({children } : {children: React.ReactNode}) => {
    console.log("Unauthenticated layout rendered");
  return (
    <RequireUnauthenticated>
        {children}
    </RequireUnauthenticated>
  )
}

export default layout