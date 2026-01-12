import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(req: Request) {
  const body = await req.json()
  const { name, email, password } = body

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 400 }
    )
  }

  try {
    // 1. Cria o usuário no auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name, // salva como metadata do usuário
        },
      },
    })

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    // 2. Cria o perfil na tabela profiles
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          name: name,
          email: email,
        })

      if (profileError) {
        console.error('Erro ao criar perfil:', profileError)
        // Se falhar o perfil, tenta deletar o usuário criado
        await supabase.auth.admin.deleteUser(authData.user.id)
        return NextResponse.json({ 
          error: "Erro ao criar perfil do usuário" 
        }, { status: 500 })
      }
    }

    return NextResponse.json({ 
      success: true, 
      user: authData.user 
    })

  } catch (error) {
    console.error('Erro no registro:', error)
    return NextResponse.json({ 
      error: "Erro interno do servidor" 
    }, { status: 500 })
  }
}
