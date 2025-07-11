import Superadminheader from '@/app/common/superadminheader'
import { CustomBreadCrums } from '@/components/breadcrums'
import React from 'react'

const Page = () => {
    return (
        <div>
            <Superadminheader />
            <CustomBreadCrums
                item={{
                    heading: 'Pending User List',
                    links: [
                        { title: 'Home', name: '/super-admin' },
                        { title: 'Pending User List', name: '/super-admin/user/pending-user-list' }
                    ]
                }}
            />
            Coming Soon: Create Pending User List Page

        </div>
    )
}

export default Page