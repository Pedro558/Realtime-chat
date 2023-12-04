import { FC } from 'react'
import SignInForm from '@/components/form/SignInForm'
import Image from 'next/image'

interface PageProps{}

const Page: FC<PageProps> = () => {
  return(
    <>
     <div className='flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
        <div className='w-full flex flex-col items-center max-w-md space-y-8'>
          <div className='flex flex-col items-center gap-8'>
            <Image
             src="/play-for-a-cause-logo-.png"
             width={150}
             height={150}
             alt="Picture of the author"
            />
            <h2 className='mt-6 text-center text-3xl font-bold tracking-tight text-gray-900'>
              Welcome to the Realtime chat
            </h2>
          </div>
          
          <SignInForm/>
    
        </div>
      </div>

    </>
    
  )
}

export default Page;