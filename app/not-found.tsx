import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div className='flex items-center justify-center h-full w-full min-h-[70vh]'>
      <div className="mb-8 flex flex-col items-center space-y-3">
        <h1 className='text-6xl sm:text-8xl text-center mb-4 font-bold tracking-wider'>404</h1>
        <p className='mb-12 text-center'>Eh, It appears that you are accessing a menu that does not exist.</p>
        <Link href={"/"} className=''>
          <Button variant={"outline"} className="h-[44px]">
            <ArrowLeft /> Back to Home
          </Button>
        </Link>
      </div>
    </div>
  )
}