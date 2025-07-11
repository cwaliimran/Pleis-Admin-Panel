import Superadminheader from '@/app/common/superadminheader'
import { CustomBreadCrums } from '@/components/breadcrums'
import React from 'react'

const Page = () => {
    return (
        <div>
            <Superadminheader />
            <CustomBreadCrums
                item={{
                    heading: 'Tags',
                    links: [
                        { title: 'Home', name: '/super-admin' },
                        { title: 'Create Tag', name: '/super-admin/tag' }
                    ]
                }}
            />
            Coming Soon:Create Tag Page
        </div>
    )
}

export default Page