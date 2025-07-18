
"use client"
import { useParams } from 'next/navigation'
import React from 'react'
import Header from '../../../../common/header';
import UserDetailPage from '@/sections/users/userDetailPage';

const Page = () => {
    const id = useParams<any>();

    return (
        <div>
            <Header
                links={[
                    { name: "Dashboard", href: "/organizer/dashboard" },
                    { name: "Organization", href: "/super-admin/organization" },
                    { name: "Organization Details" },
                ]}
            />
            <UserDetailPage id={id} />
        </div>
    )
}

export default Page
