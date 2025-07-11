import Superadminheader from '@/app/common/superadminheader'
import { CustomBreadCrums } from '@/components/breadcrums'
import React from 'react'

const Page = () => {
    return (
        <div>
            <Superadminheader />
            <CustomBreadCrums
                item={{
                    heading: 'Create Region',
                    links: [
                        { title: 'Home', name: '/super-admin' },
                        { title: 'Create Region', name: '/super-admin/region/create-region' }
                    ]
                }}
            />
            Coming Soon: Create Region Page
        </div>
    )
}

export default Page