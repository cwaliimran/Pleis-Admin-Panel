import Superadminheader from '@/app/common/superadminheader'
import { CustomBreadCrums } from '@/components/breadcrums'
import React from 'react'

const Page = () => {
  return (
    <div>
      <Superadminheader />
      <CustomBreadCrums
        item={{
          heading: 'User List',
          links: [
            { title: 'Home', name: '/super-admin' },
            { title: 'User List', name: 'super-admin/user/user-list' }
          ]
        }}
      />
      Coming Soon: Create User List Page
    </div>
  )
}

export default Page