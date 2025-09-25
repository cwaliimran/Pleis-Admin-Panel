import Superadminheader from '@/app/common/superadminheader'
import { CustomBreadCrums } from '@/components/breadcrums'
import React from 'react'

const Page = () => {
    return (
        <div>
            <Superadminheader />
            <CustomBreadCrums
                item={{
                    heading: 'Refund List',
                    links: [
                        { title: 'Home', name: '/super-admin' },
                        { title: 'Refund List', name: 'create-venue' }
                    ]
                }}
            />
        </div>
    )
}

export default Page