"use client"
import Header from '@/app/common/header'
import Superadminheader from '@/app/common/superadminheader'
import { MarketingRequestTable } from '@/sections/marketingrequest'
import React from 'react'

const Page = () => {
    return (
        <div>
            <Header
                links={[
                    { name: "Dashboard", href: "/super-admin/dashboard" },
                    { name: "Marketing Requests List", href: "" }
                ]}
            />
            <MarketingRequestTable />
        </div>
    )
}

export default Page