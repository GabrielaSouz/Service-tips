"use client"

import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Input } from "@/components/ui/input"
import { Database } from "lucide-react"

interface Props {
  onChange?: () => void // opcional, para avisar o AdminPage quando algo muda
  globalSearch?: string // search global da AdminPage
}

type Category = {
  id: string
  name: string
}

export default function CategoriesManager({ onChange, globalSearch }: Props) {
  const [categories, setCategories] = useState<Category[]>([])
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([])
  const [search, setSearch] = useState("")
  const [form, setForm] = useState<{ name?: string }>({})
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null)
  const [existingCategory, setExistingCategory] = useState<Category | null>(null)

  // 🔄 Carrega categorias do servidor
  async function loadCategories() {
    try {
      const res = await fetch("/api/categories")
      const data = await res.json()
      const sorted = data.sort((a: Category, b: Category) => a.name.localeCompare(b.name))
      setCategories(sorted)
      setFilteredCategories(sorted)
    } catch (err) {
      console.error("Erro ao carregar categorias:", err)
      toast.error("Erro ao carregar categorias")
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  // 🔄 Filtra categorias e verifica se já existe
  useEffect(() => {
    const filtered = categories.filter(category =>
      category.name.toLowerCase().includes(search.toLowerCase())
    )
    setFilteredCategories(filtered)

    // Verifica se o nome digitado já existe
    if (search.trim()) {
      const existing = categories.find(cat => 
        cat.name.toLowerCase() === search.toLowerCase() && 
        cat.id !== editingId
      )
      setExistingCategory(existing || null)
    } else {
      setExistingCategory(null)
    }
  }, [categories, search, editingId, globalSearch])

  // Sincroniza search local com globalSearch
  useEffect(() => {
    if (globalSearch !== undefined) {
      setSearch(globalSearch)
    }
  }, [globalSearch])

  // ✍️ Criar ou atualizar categoria
  async function handleSubmit() {
    if (!form.name?.trim()) {
      toast.error("Informe o nome da categoria")
      return
    }

    // Verifica se já existe (exceto se estiver editando)
    const existing = categories.find(cat => 
      cat.name.toLowerCase() === form.name!.toLowerCase() && 
      cat.id !== editingId
    )
    
    if (existing && !editingId) {
      toast.error("Esta categoria já existe!")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/categories", {
        method: editingId ? "PUT" : "POST",
        body: JSON.stringify(
          editingId
            ? { id: editingId, name: form.name }
            : { name: form.name }
        ),
      })

      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || "Erro ao salvar categoria")
        return
      }

      setForm({})
      setEditingId(null)
      await loadCategories()
      if (onChange) onChange() // avisa AdminPage

      toast.success(editingId ? "Categoria atualizada com sucesso!" : "Categoria criada com sucesso!")
    } catch (err) {
      console.error("Erro ao salvar categoria:", err)
      toast.error("Erro ao salvar categoria")
    } finally {
      setLoading(false)
    }
  }

  // ❌ Deletar categoria
  async function handleDelete(id: string) {
    setCategoryToDelete(id)
    setDeleteDialogOpen(true)
  }

  async function confirmDelete() {
    if (!categoryToDelete) return

    setLoading(true)
    try {
      const res = await fetch("/api/categories", {
        method: "DELETE",
        body: JSON.stringify({ id: categoryToDelete }),
      })

      if (!res.ok) {
        const data = await res.json()
        toast.error(data.error || "Erro ao excluir categoria")
        return
      }

      await loadCategories()
      if (onChange) onChange()
      toast.success("Categoria excluída com sucesso!")
    } catch (err) {
      console.error("Erro ao deletar categoria:", err)
      toast.error("Erro ao excluir categoria")
    } finally {
      setLoading(false)
      setCategoryToDelete(null)
    }
  }

  // Editar categoria
  function handleEdit(category: Category) {
    setEditingId(category.id)
    setForm({ name: category.name })
    setSearch(category.name)
  }

  function handleCancel() {
    setEditingId(null)
    setForm({})
    setSearch("")
    setExistingCategory(null)
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold mb-6 text-slate-900">Adicionar/Editar Categoria</h2>
        
        <div className="space-y-4">
          <div className="relative">
            <Input
              placeholder="Digite o nome da categoria..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setForm({ name: e.target.value })
              }}
              disabled={loading}
              className="pr-24"
            />
            
            {/* Indicador visual de categoria existente */}
            {existingCategory && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <span className="text-xs text-emerald-600 font-medium">
                  ✓ {existingCategory.name}
                </span>
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            {editingId && (
              <Button variant="outline" onClick={handleCancel} disabled={loading}>
                Cancelar
              </Button>
            )}
            
            {/* Botão Salvar só aparece se não existir categoria com mesmo nome */}
            {!existingCategory && search.trim() && (
              <Button onClick={handleSubmit} disabled={loading}>
                {editingId ? "Atualizar" : "Salvar"}
              </Button>
            )}
            
            {/* Se estiver editando, mostra o botão mesmo que exista */}
            {editingId && (
              <Button onClick={handleSubmit} disabled={loading}>
                Atualizar
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">
            Categorias ({filteredCategories.length})
          </h2>
          {search && (
            <Button variant="outline" size="sm" onClick={() => {
              setSearch("")
              setForm({})
              setExistingCategory(null)
            }}>
              Limpar Filtro
            </Button>
          )}
        </div>

        {filteredCategories.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-slate-400 mb-4">
              <Database className="h-12 w-12 mx-auto" />
            </div>
            <p className="text-slate-600">
              {search ? "Nenhuma categoria encontrada para esta busca." : "Nenhuma categoria cadastrada ainda."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredCategories.map((category) => (
              <div
                key={category.id}
                className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${
                  existingCategory?.id === category.id 
                    ? "border-emerald-500 bg-emerald-50" 
                    : "border-slate-200 hover:border-emerald-500"
                }`}
              >
                <span className="font-medium text-slate-900 truncate flex-1">
                  {category.name}
                </span>
                <div className="flex gap-2 ml-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEdit(category)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(category.id)}
                  >
                    Excluir
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Excluir Categoria"
        description="Tem certeza que deseja excluir esta categoria? Esta ação não pode ser desfeita."
        onConfirm={confirmDelete}
        confirmText="Excluir"
        cancelText="Cancelar"
        loading={loading}
      />
    </div>
  )
}
