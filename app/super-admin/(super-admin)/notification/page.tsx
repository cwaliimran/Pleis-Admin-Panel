import Header from '@/app/common/header'
import React from 'react'

const Page = () => {
    return (
        <div>
            <Header
                links={[
                    { name: "Dashboard", href: "/super-admin" },
                    { name: "Notification", href: "" },
                ]}
            />
            coming Soon
        </div>
    )
}

export default Page