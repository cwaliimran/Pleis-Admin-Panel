
import React from 'react'
import Header from '../../../common/header'

const Page = () => {
    return (
        <div>
            <Header
                links={[
                    { name: "Dashboard", href: "/organizer/dashboard" },
                    { name: "Boost" },
                ]}
            />
            Comming Soon</div>
    )
}

export default Page