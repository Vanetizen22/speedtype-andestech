import { NextResponse } from 'next/server'
import { z } from 'zod'
import { ADMIN_COOKIE_NAME, createAdminSession, validateAdminCredentials } from '@/lib/auth'

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
})

export async function POST(request: Request) {
  try {
    const body = loginSchema.parse(await request.json())

    if (!validateAdminCredentials(body.username, body.password)) {
      return NextResponse.json({ error: 'Credenciales invalidas' }, { status: 401 })
    }

    const { token, expiresAt } = await createAdminSession()
    const response = NextResponse.json({ ok: true })

    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      expires: expiresAt,
    })

    return response
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Datos invalidos' }, { status: 400 })
    }

    console.error(error)
    return NextResponse.json({ error: 'No se pudo iniciar sesion' }, { status: 500 })
  }
}