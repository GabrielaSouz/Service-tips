import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"


//Listar Categorias
export async function GET() {
  const { data, error } = await supabase
    .from("categories")
    .select(`id, name`).order("created_at", {ascending: false})

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

//Criar Categoria
export async function POST(req: Request) {
  const { name } = await req.json()

  const { error } = await supabase
    .from("categories")
    .insert([{ name }])

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "Categoria já existe" },
        { status: 409 }
      )
    }

    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true }, { status: 201 })
}


//Editar Categoria
export async function PUT(req: Request) {
  const { id, name } = await req.json()

  const { error } = await supabase
    .from("categories")
    .update({ name })
    .eq("id", id)

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "Já existe uma categoria com esse nome" },
        { status: 409 }
      )
    }

    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

//Deletar Categoria
export async function DELETE(req: Request) {
  const body = await req.json()

  const { data, error } = await supabase
    .from("categories")
    .delete()
    .eq("id", body.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 200 })
}
