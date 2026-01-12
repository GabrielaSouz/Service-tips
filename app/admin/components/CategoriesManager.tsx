"use client"

import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Input } from "@/components/ui/input"

interface Props {
  onChange?: () => void // opcional, para avisar o AdminPage quando algo muda
}

type Category = {
  id: string
  name: string
}

export default function CategoriesManager({ onChange }: Props) {
  const [categories, setCategories] = useState<Category[]>([])
  const [form, setForm] = useState<{ name?: string }>({})
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null)

  // 🔄 Carrega categorias do servidor
  async function loadCategories() {
    try {
      const res = await fetch("/api/categories")
      const data = await res.json()
      setCategories(data)
    } catch (err) {
      console.error("Erro ao carregar categorias:", err)
      toast.error("Erro ao carregar categorias")
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  // ✍️ Criar ou atualizar categoria
  async function handleSubmit() {
    if (!form.name?.trim()) {
      toast.error("Informe o nome da categoria")
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
  }

  function handleCancel() {
    setEditingId(null)
    setForm({})
  }

  return (
    <div className="p-6  ">

      <div className="border rounded-lg p-6 space-y-4">
        <h1 className="text-xl font-bold">Categorias</h1>
        {/* FORM */}
        <div className="flex flex-col justify-between items-center md:flex-row gap-4">


          <Input
            className="border p-2 w-full"
            value={form.name || ""}
            onChange={(e) => setForm({ name: e.target.value })}
            placeholder="Nome da categoria"
            disabled={loading}
          />

          <div className="flex gap-2 ">
            {editingId && (
              <Button variant="outline" onClick={handleCancel} disabled={loading}>
                Cancelar
              </Button>
            )}
            <Button onClick={handleSubmit} disabled={loading} >
              {editingId ? "Atualizar" : "Salvar"}
            </Button>
          </div>
        </div>

        {/* LISTAGEM */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex justify-between items-center border p-2 rounded-lg"
            >
              <span>{category.name}</span>
              <div className="space-x-2">
                <Button variant="outline" onClick={() => handleEdit(category)}>
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(category.id)}
                >
                  Excluir
                </Button>
              </div>
            </div>
          ))}
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
    </div>
  )
}
