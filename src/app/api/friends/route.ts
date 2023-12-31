import { addFriendValidator } from '@/lib/validations/add-friend'

export async function POST(req: Request){
  try {
    const body = await req.json()

    const { email: emailToAdd } = addFriendValidator.parse(body.email)

    const RESTResponse = await fetch(
      `${process.env.UPSTASH_REDIS_REST_URL}/get/user:email.${emailToAdd}`, {
      headers: {
        Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`
      },
      cache: 'no-store'
    })

    const data = await RESTResponse.json() as {result: string}

    console.log(data)

  } catch (error) {
    
  }
}