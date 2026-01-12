import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(req: Request){
    const body = await req.json()
    const { email, password } = body

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return NextResponse.json({ error: error.message}, { status: 401 })
    }

    // Retorna o usuário e a sessão completa com o token
    return NextResponse.json({ 
        user: data.user,
        session: data.session
    })
}