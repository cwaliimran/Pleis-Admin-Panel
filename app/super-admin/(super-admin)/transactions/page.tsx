import Header from '@/app/common/header'
import React from 'react'

const Page = () => {
    return (
        <>
            <Header
                links={[
                    { name: "Dashboard", href: "/super-admin" },
                    { name: "Transaction", href: "" },
                ]}
            />
            Coming Soon
        </>
    )
}

export default Page