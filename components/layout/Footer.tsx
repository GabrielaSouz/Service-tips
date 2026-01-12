import { ShieldCheckIcon } from "lucide-react";

export default function Footer() {
    const year = new Date().getFullYear();

    return(
      <footer className="bg-slate-900 text-slate-400 py-12 px-4 border-t border-slate-800 ">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <h3 className="text-white font-serif text-xl mb-4">BrasileirasemKL</h3>
                <p className="text-sm leading-relaxed">Uma rede de apoio feita por brasileiras para brasileiras. Compartilhe o que é bom, ajude uma conterrânea a se sentir em casa.</p>
            </div>

            <div className="flex flex-col items-start md:items-end">
                <div className="flex items-center space-x-2 text-emerald-500 mb-2">
                    <ShieldCheckIcon className="h-5 w-5"/>
                    <span className="text-sm font-medium">Informação Verificada pela Comunidade</span>
                </div>
                <p className="text-xs">© {year} BrasilinasemKL. Todos os direitos reservados.</p>
            </div>
        </div>
      </footer>
    )
}