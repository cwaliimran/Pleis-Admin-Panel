'use client'
import { useRouter } from 'next/navigation'
import { Button } from '../ui/button'

const HomeButton = () => {
  const router = useRouter()
  return <Button onClick={() => router.push('/')}>Go Home</Button>
}

export { HomeButton }
