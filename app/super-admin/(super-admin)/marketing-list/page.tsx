import Superadminheader from '@/app/common/superadminheader'
import { CustomBreadCrums } from '@/components/breadcrums'
import React from 'react'

const Page = () => {
    return (
        <div>
            <Superadminheader />
            <CustomBreadCrums
                item={{
                    heading: 'Marketing List',
                    links: [
                        { title: 'Home', name: '/super-admin' },
                        { title: 'Marketing List', name: '/super-admin/marketing-list' }
                    ]
                }}
            />
            Coming Soon: Marketing List Page
        </div>
    )
}

export default Page