import Header from '@/app/common/header'
import React from 'react'

const Page = () => {
    return (
        <>
            <Header
                links={[
                    { name: "Dashboard", href: "/organizer/dashboard" },
                    { name: "Subscription", href: "" },
                ]}
            />
            Coming Soon
        </>
    )
}

export default Page