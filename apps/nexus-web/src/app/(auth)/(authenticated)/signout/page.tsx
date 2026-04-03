"use client";

import { useAuthContext } from '@/features/authentication/store/useAuthStore'
import { LINKS } from '@/lib/constants/links';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { use, useEffect } from 'react'

const page = () => {
    const {logout } = useAuthContext()

    const queries = useSearchParams();
    const callbackUrl = queries.get('callbackUrl') || undefined;

    const router = useRouter();

    useEffect(() => {
        const stuff = async () => {

        await logout()

        console.log("hell oworld")
        if (callbackUrl) {
            router.push(callbackUrl);
        } else {
            router.push(LINKS.auth_signin);
        }
        }
        stuff();
    }, [])

  return (
    <div>page</div>
  )
}

export default page;