import { Resend } from "resend"
import { NextResponse } from "next/server"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const data = await req.json()

    await resend.emails.send({
      from: "Brasileiras em KL - Indicações <onboarding@resend.dev>",
      to: ["souza.gab@hotmail.com"],
      subject: "Nova Indicação de Serviço - Brasileiras em KL",
      text: `
NOVA INDICAÇÃO DE SERVIÇO

=== QUEM INDICOU ===
Nome: ${data.name}
Telefone: ${data.phone}

=== SERVIÇO ===
Nome: ${data.serviceName}
Descrição: ${data.description}
Endereço: ${data.address}
Telefone: ${data.phoneService}
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao enviar e-mail" },
      { status: 500 }
    )
  }
}
