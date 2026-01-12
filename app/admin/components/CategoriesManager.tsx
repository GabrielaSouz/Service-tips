"use client"

import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

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

  // 🔄 Carrega categorias do servidor
  async function loadCategories() {
    try {
      const res = await fetch("/api/categories")
      const data = await res.json()
      setCategories(data)
    } catch (err) {
      console.error("Erro ao carregar categorias:", err)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  // ✍️ Criar ou atualizar categoria
  async function handleSubmit() {
    if (!form.name?.trim()) {
      alert("Informe o nome da categoria")
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
        alert(data.error || "Erro ao salvar categoria")
        return
      }

      setForm({})
      setEditingId(null)
      await loadCategories()
      if (onChange) onChange() // avisa AdminPage
    } catch (err) {
      console.error("Erro ao salvar categoria:", err)
    } finally {
      setLoading(false)
    }
  }

  // Deletar categoria
  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja excluir esta categoria?")) return

    setLoading(true)
    try {
      await fetch("/api/categories", {
        method: "DELETE",
        body: JSON.stringify({ id }),
      })
      await loadCategories()
      if (onChange) onChange()
    } catch (err) {
      console.error("Erro ao deletar categoria:", err)
    } finally {
      setLoading(false)
    }
  }

  // Editar categoria
  function handleEdit(category: Category) {
    setEditingId(category.id)
    setForm({ name: category.name })
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Categorias</h1>

      {/* FORM */}
      <div className="flex flex-col md:flex-row gap-4">
        <input
          className="border p-2 w-full"
          value={form.name || ""}
          onChange={(e) => setForm({ name: e.target.value })}
          placeholder="Nome da categoria"
          disabled={loading}
        />

        <Button onClick={handleSubmit} disabled={loading}>
          {editingId ? "Atualizar" : "Salvar"}
        </Button>
      </div>

      {/* LISTAGEM */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex justify-between items-center border p-2 rounded"
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
    </div>
  )
}
