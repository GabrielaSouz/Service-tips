"use client"

import Link from "next/link";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function Register() {
   const router = useRouter()
   const [name, setName] = useState("")
   const [email, setEmail] = useState("")
   const [password, setPassword] = useState("")
   const [loading, setLoading] = useState(false)

   async function handleRegister(e: React.FormEvent) {
      e.preventDefault()
      setLoading(true)
 
      try {
         const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: {
               "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, email, password })
         })
 
         const data = await res.json()
         setLoading(false)

         if (!data.success) {
            toast.error(data.error || "Erro ao criar conta")
            return
         }

         toast.success("Conta criada com sucesso! Verifique seu email para confirmar.")
         // Limpa o formulário
         setName("")
         setEmail("")
         setPassword("")
         // Redireciona para a página de login
         router.push("/login")
      } catch (error) {
         setLoading(false)
         toast.error("Erro de conexão. Tente novamente.")
      }
   }

   return (
      <div className="h-screen flex flex-col justify-center items-center bg-gray-50">
         <div className="bg-white rounded-lg shadow-md w-full max-w-md">

            {/* Imagem acima do título */}
            <Image
               src="/background-register.jpg"
               alt="Register"
               width={500}
               height={500}
               className="mx-auto w-full h-48 object-cover mb-2 rounded-t-lg"
            />
            <div className="p-8">
               <h1 className="text-3xl text-slate-6000 mb-4 text-center font-serif">
                  Get Started <span className="text-emerald-600 italic">Now</span>
               </h1>

               {/* Links */}
               <div className="flex justify-around items-center text-slate-600 text-sm mb-6">
                  <Link href="/login" className="hover:text-emerald-600 transition-colors">Login</Link>
                  <span className="text-emerald-600 font-bold text-base">|</span>
                  <Link href="/register" className="font-semibold text-emerald-600">Cadastro</Link>
                   <span className="text-emerald-600 font-bold text-base  hover:text-emerald-600 transition-colors">|</span>
            <Link href="/" className=" hover:text-emerald-600 transition-colors">Página Inicial</Link>
               </div>

               {/* Form */}
               <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-1">
                     <Label htmlFor="name" className="text-slate-800">Name</Label>
                     <Input id="name" value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="Enter your name" className="text-sm" />
                  </div>

                  <div className="space-y-1">
                     <Label htmlFor="email" className="text-slate-800">Email</Label>
                     <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Enter your email" className="text-sm" />
                  </div>

                  <div className="space-y-1">
                     <Label htmlFor="password" className="text-slate-800">Password</Label>
                     <Input id="password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Enter your password" className="text-sm" />
                  </div>

                  <Button type="submit" className="w-full mt-4" disabled={loading}>{loading ? "Loading..." : "Sign Up"}</Button>

               </form>
            </div>
         </div>
      </div>
   )
}