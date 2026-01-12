import Link from "next/link";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Login() {
    return(
        <div className="h-screen flex flex-col justify-center items-center bg-gray-50">
        <div className="bg-white rounded-lg shadow-md w-full max-w-md">
              
              {/* Imagem acima do título */}
        <Image
          src="/background-login.jpg"
          alt="Login"
          width={500}
          height={500}
          className="mx-auto w-full h-48 object-cover mb-2 rounded-t-lg"
        />
           <div className="p-8">
             <h1 className="text-3xl text-slate-6000 mb-4 text-center font-serif">
             Welcome <span className="text-emerald-600 italic">back!</span>
           </h1>

        {/* Links */}
           <div className="flex justify-around items-center text-slate-600 text-sm mb-6">
            <Link href="/login" className="font-semibold text-emerald-600">Login</Link>
            <span className="text-emerald-600 font-bold text-base  hover:text-emerald-600 transition-colors">|</span>
            <Link href="/register" className=" hover:text-emerald-600 transition-colors">Register</Link>
           </div>

           {/* Form */}
           <form className="space-y-4">
            
            <div className="space-y-1">
            <Label htmlFor="email" className="text-slate-800">Email</Label>
            <Input id="email" type="email" placeholder="Enter your email" className="text-sm"/>
           </div>

           <div className="space-y-1">
            <Label htmlFor="password" className="text-slate-800">Password</Label>
            <Input id="password" type="password" placeholder="Enter your password" className="text-sm"/>
           </div>

        <Button type="submit" className="w-full mt-4">Sign Up</Button>
           
           </form>
           </div>
           </div>
        </div>
    )
}