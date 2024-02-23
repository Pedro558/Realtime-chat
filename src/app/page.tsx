import { db } from '@/lib/db';

export default async function Home() {
  await db.set('hello', 'world');
  
  return(
    <div>
      <div className='text-red-500'>
        Hello World
      </div>

      <nav role='navigation'>
        Menu
      </nav>
    </div>
  )
}
  