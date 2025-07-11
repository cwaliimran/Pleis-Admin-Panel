import Superadminheader from '@/app/common/superadminheader'
import { CustomBreadCrums } from '@/components/breadcrums'
import React from 'react'

const Page = () => {
  return (
    <div>
      <Superadminheader />
      <CustomBreadCrums
        item={{
          heading: 'Organization List',
          links: [
            { title: 'Home', name: '/super-admin' },
            { title: 'Organization List', name: '/super-admin/organization/organization-list' }
          ]
        }}
      />
      Coming Soon: Create Organization List Page
    </div>
  )
}

export default Page