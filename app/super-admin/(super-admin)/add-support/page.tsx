import Superadminheader from '@/app/common/superadminheader'
import { CustomBreadCrums } from '@/components/breadcrums'
import React from 'react'

const Page = () => {
  return (
    <>
      <Superadminheader />
      <CustomBreadCrums
        item={{
          heading: 'Add Support Info',
          links: [
            { title: 'Home', name: '/super-admin' },
            { title: 'Support', name: '/super-admin/add-support' }
          ]
        }}
      />
      Coming Soon
    </>
  )
}

export default Page