"use client"
import { HomeButton } from '@/components/atoms/home-button'
import { ModeToggle } from '@/components/atoms/mode-toggle'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
  BreadcrumbPage
} from '@/components/ui/breadcrumb'

const NotFound = () => {
  return (
    <div className='flex flex-col min-h-svh'>
      <header className='flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12'>
        <div className='flex items-center gap-2 px-4'>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className='hidden md:block'>
                {/* <BreadcrumbLink href="#"> */}
                Error
                {/* </BreadcrumbLink> */}
              </BreadcrumbItem>
              <BreadcrumbSeparator className='hidden md:block' />
              <BreadcrumbItem>
                <BreadcrumbPage>Page Not Found</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className='flex items-center gap-2 px-4'>
          <ModeToggle />
        </div>
      </header>
      <div className='flex h-full flex-col items-center justify-center p-6 md:p-10 gap-6'>
        <div className='w-full max-w-sm md:max-w-3xl text-center'>
          <h3>This page does not exist.</h3>
        </div>
        <HomeButton />
      </div>
    </div>
  )
}

export default NotFound
