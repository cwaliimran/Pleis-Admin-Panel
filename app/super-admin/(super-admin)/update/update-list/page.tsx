import Superadminheader from '@/app/common/superadminheader'
import { CustomBreadCrums } from '@/components/breadcrums'
import React from 'react'

const Page = () => {
    return (
        <div>
            <Superadminheader />
            <CustomBreadCrums
                item={{
                    heading: 'Update List',
                    links: [
                        { title: 'Home', name: '/super-admin' },
                        { title: 'Update List', name: '/super-admin/update/update-list' }
                    ]
                }}
            />
            Coming Soon: Create Update List Page
        </div>
    )
}

export default Page