import Superadminheader from '@/app/common/superadminheader'
import { CustomBreadCrums } from '@/components/breadcrums'
import React from 'react'

const Page = () => {
    return (
        <div>
            <Superadminheader />
            <CustomBreadCrums
                item={{
                    heading: 'Transaction List',
                    links: [
                        { title: 'Home', name: '/super-admin' },
                        { title: 'Transaction List', name: '/super-admin/transaction/refund-list' }
                    ]
                }}
            />
            Coming Soon: Transaction List Page
        </div>
    )
}

export default Page