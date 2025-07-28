import Superadminheader from '@/app/common/superadminheader'
import { CustomBreadCrums } from '@/components/breadcrums'
import React from 'react'

const Page = () => {
  return (
    <>
        <Superadminheader/>
            <CustomBreadCrums
                item={{
                    heading: 'Region List',
                    links: [
                        { title: 'Home', name: '/super-admin' },
                        { title: 'Region', name: '/super-admin/region/region-list' }
                    ]
                }}
            />
        Coming Soon: Region List Page
    </>
  )
}

export default Page