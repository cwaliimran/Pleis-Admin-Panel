'use client'

import { Loader2 } from 'lucide-react'
import { FC, ReactNode } from 'react'

interface AppLoadingProps {}

const AppLoading: FC<AppLoadingProps> = ({}) => {
  return (
    <div className='flex items-center justify-center w-full min-h-[90vh] h-full'>
      <Loader2 className='animate-spin' />
    </div>
  )
}

export { AppLoading }
