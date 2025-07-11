import Superadminheader from '@/app/common/superadminheader'
import { CustomBreadCrums } from '@/components/breadcrums'
import React from 'react'

const Page = () => {
  return (
    <div>
      <Superadminheader />
      <CustomBreadCrums
        item={{
          heading: 'Dashboard',
          links: [
            { title: 'Home', name: '/super-admin' },
            { title: 'Dashboard', name: '/super-admin' }
          ]
        }}
      />
      Super Admin Dashboard Main Page</div>
  )
}

export default Page