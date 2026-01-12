import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

// LISTAR SERVIÇOS
export async function GET() {
  const { data, error } = await supabase
    .from("services")
    .select(`
      id,
      name,
      description,
      address,
      phone,
      category_id,
      categories (name)
    `)
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

// CRIAR SERVIÇO
export async function POST(req: Request) {
  const body = await req.json()

  const { error } = await supabase.from("services").insert([
    {
      name: body.name,
      description: body.description,
      address: body.address,
      phone: body.phone,
      category_id: body.category_id,
    },
  ])

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true }, { status: 201 })
}

// EDITAR SERVIÇO
export async function PUT(req: Request) {
  const body = await req.json()

  const { error } = await supabase
    .from("services")
    .update({
      name: body.name,
      description: body.description,
      address: body.address,
      phone: body.phone,
      category_id: body.category_id,
    })
    .eq("id", body.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

// DELETAR SERVIÇO
export async function DELETE(req: Request) {
  const { id } = await req.json()

  const { error } = await supabase
    .from("services")
    .delete()
    .eq("id", id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
