import { NextResponse } from "next/server"
import { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  // Se não está tentando acessar rotas protegidas, continua
  if (!req.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  // Verifica se tem o cookie de autenticação
  const authToken = req.cookies.get('sb-access-token')?.value

  if (!authToken) {
    // Redireciona para login se não tiver token
    const loginUrl = new URL('/login', req.url)
    return NextResponse.redirect(loginUrl.toString())
  }

  // Permite o acesso se tiver o token (validação mais simples)
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
}
