"use client"

import { useEffect, useState } from "react"
import ServiceCard, { Service } from "@/components/services/ServiceCard"

export interface Category {
  id: string
  name: string
}

interface Props {
  categories: Category[]
  onCategoriesChange?: () => void // opcional para atualizar categorias quando necessário
}

interface ServiceForm {
  name?: string
  description?: string
  address?: string
  phone?: string
  category_id?: string
}

export default function ServicesManager({ categories, onCategoriesChange }: Props) {
  const [services, setServices] = useState<Service[]>([])
  const [form, setForm] = useState<ServiceForm>({})
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function loadServices() {
    try {
      const res = await fetch("/api/services")
      const data = await res.json()
      const formatted: Service[] = data.map((s: any) => ({
        id: s.id,
        name: s.name,
        description: s.description,
        address: s.address,
        phone: s.phone,
        category_id: s.category_id,
        categoryName: s.categories?.name || "Sem categoria",
      }))
      setServices(formatted)
    } catch (err) {
      console.error("Erro ao carregar serviços:", err)
    }
  }

  useEffect(() => {
    loadServices()
  }, [])

  async function handleSubmit() {
    if (!form.name?.trim()) {
      alert("Informe o nome do serviço")
      return
    }

    setLoading(true)
    try {
      const method = editingId ? "PUT" : "POST"
      const body = editingId ? { ...form, id: editingId } : form

      const res = await fetch("/api/services", {
        method,
        body: JSON.stringify(body),
      })

      const data = await res.json()
      if (!res.ok) {
        alert(data.error || "Ocorreu um erro")
        return
      }

      setForm({})
      setEditingId(null)
      await loadServices()
      if (onCategoriesChange) onCategoriesChange() // opcional
    } catch (err) {
      console.error("Erro ao salvar serviço:", err)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Deseja remover este serviço?")) return

    setLoading(true)
    try {
      await fetch("/api/services", {
        method: "DELETE",
        body: JSON.stringify({ id }),
      })
      await loadServices()
    } catch (err) {
      console.error("Erro ao deletar serviço:", err)
    } finally {
      setLoading(false)
    }
  }

  function handleEdit(service: Service) {
    setEditingId(service.id)
    setForm(service)
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-bold">Serviços</h2>

      {/* FORM */}
      <div className="space-y-2 border p-4 rounded">
        <input
          className="border p-2 w-full"
          placeholder="Nome"
          value={form.name || ""}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          disabled={loading}
        />

        <textarea
          className="border p-2 w-full"
          placeholder="Descrição"
          value={form.description || ""}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          disabled={loading}
        />

        <input
          className="border p-2 w-full"
          placeholder="Endereço"
          value={form.address || ""}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          disabled={loading}
        />

        <input
          className="border p-2 w-full"
          placeholder="Telefone"
          value={form.phone || ""}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          disabled={loading}
        />

        <select
          className="border p-2 w-full"
          value={form.category_id || ""}
          onChange={(e) => setForm({ ...form, category_id: e.target.value })}
          disabled={loading}
        >
          <option value="">Selecione a categoria</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <button
          onClick={handleSubmit}
          className="bg-black text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {editingId ? "Atualizar Serviço" : "Salvar Serviço"}
        </button>
      </div>

      {/* LISTAGEM */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            variant="admin"
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  )
}
