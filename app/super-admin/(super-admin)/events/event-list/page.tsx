import Superadminheader from '@/app/common/superadminheader'
import { CustomBreadCrums } from '@/components/breadcrums'
import React from 'react'

const Page = () => {
  return (
    <div>
      <Superadminheader />
      <CustomBreadCrums
        item={{
          heading: 'Event List',
          links: [
            { title: 'Home', name: '/super-admin' },
            { title: 'Event List', name: '/super-admin/event/event-list' }
          ]
        }}
      />
      Coming Soon: Create Event List Page
    </div>
  )
}

export default Page