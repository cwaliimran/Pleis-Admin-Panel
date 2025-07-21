import Superadminheader from '@/app/common/superadminheader'
import { CustomBreadCrums } from '@/components/breadcrums'
import React from 'react'

const Page = () => {
    return (
        <div>
            <Superadminheader />
            <CustomBreadCrums
                item={{
                    heading: 'Premium Transaction',
                    links: [
                        { title: 'Home', name: '/super-admin' },
                        { title: 'Premium Transaction', name: '/super-admin/transaction/premium-transaction' }
                    ]
                }}
            />
            Coming Soon: Premium Transaction Page
        </div>
    )
}

export default Page