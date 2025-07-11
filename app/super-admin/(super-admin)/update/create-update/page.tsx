import Superadminheader from '@/app/common/superadminheader'
import { CustomBreadCrums } from '@/components/breadcrums'
import React from 'react'

const Page = () => {
    return (
        <div>
            <Superadminheader />
            <CustomBreadCrums
                item={{
                    heading: 'Create Update',
                    links: [
                        { title: 'Home', name: '/super-admin' },
                        { title: 'Update', name: '/super-admin/update/create-update' }
                    ]
                }}
            />
            Coming Soon: Create Update Page
        </div>
    )
}

export default Page