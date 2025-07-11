import Superadminheader from '@/app/common/superadminheader'
import { CustomBreadCrums } from '@/components/breadcrums'
import React from 'react'

const Page = () => {
  return (
    <>
      <Superadminheader />
      <CustomBreadCrums
        item={{
          heading: 'Venue List',
          links: [
            { title: 'Home', name: '/super-admin' },
            { title: 'Venue List', name: '/super-admin/venue/venue-list' }
          ]
        }}
      />
    </>
  )
}

export default Page