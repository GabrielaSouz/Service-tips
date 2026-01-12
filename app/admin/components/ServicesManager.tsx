"use client"

import { useEffect, useState } from "react"
import ServiceCard, { Service } from "@/components/services/ServiceCard"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Input } from "@/components/ui/input"
import { SearchCheck } from "lucide-react"

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
  const [search, setSearch] = useState("")
  const [filteredServices, setFilteredServices] = useState<Service[]>([])
  const [form, setForm] = useState<ServiceForm>({})
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null)

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
      toast.error("Erro ao carregar serviços")
    }
  }

  useEffect(() => {
    loadServices()
  }, [])

  useEffect(() => {
    const filtered = services.filter(service => 
      service.name.toLowerCase().includes(search.toLowerCase()) ||
      service.description.toLowerCase().includes(search.toLowerCase()) ||
      service.address.toLowerCase().includes(search.toLowerCase()) ||
      service.categoryName.toLowerCase().includes(search.toLowerCase())
    )
    setFilteredServices(filtered)
  }, [services, search])

  async function handleSubmit() {
    if (!form.name?.trim()) {
      toast.error("Informe o nome do serviço")
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
        toast.error(data.error || "Erro ao salvar serviço")
        return
      }

      setForm({})
      setEditingId(null)
      await loadServices()
      if (onCategoriesChange) onCategoriesChange()

      toast.success(editingId ? "Serviço atualizado com sucesso!" : "Serviço criado com sucesso!")
    } catch (err) {
      console.error("Erro ao salvar serviço:", err)
      toast.error("Erro ao salvar serviço")
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    setServiceToDelete(id)
    setDeleteDialogOpen(true)
  }

  async function confirmDelete() {
    if (!serviceToDelete) return

    setLoading(true)
    try {
      const res = await fetch("/api/services", {
        method: "DELETE",
        body: JSON.stringify({ id: serviceToDelete }),
      })

      if (!res.ok) {
        const data = await res.json()
        toast.error(data.error || "Erro ao excluir serviço")
        return
      }

      await loadServices()
      toast.success("Serviço excluído com sucesso!")
    } catch (err) {
      console.error("Erro ao deletar serviço:", err)
      toast.error("Erro ao excluir serviço")
    } finally {
      setLoading(false)
      setServiceToDelete(null)
    }
  }

  function handleEdit(service: Service) {
    setEditingId(service.id)
    setForm(service)
  }

  function handleCancel() {
    setEditingId(null)
    setForm({})
  }

  return (
    <div className="p-6 space-y-4">

      {/* FORM */}
      <div className="space-y-2.5 border p-6 rounded-lg">
        <h2 className="text-xl font-bold">Serviços</h2>

        <Input
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


        <div className="flex justify-between items-center gap-4 ">
          <Input
            className="border p-2 w-full"
            placeholder="Endereço"
            value={form.address || ""}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            disabled={loading}
          />
          <Input
            className="border p-2 w-full"
            placeholder="Telefone"
            value={form.phone || ""}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            disabled={loading}
          />

        </div>

        <div className="flex gap-2 mt-4">
          {editingId ? (
            <>
              <Button
                className="w-1/2"
                variant="outline"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                className="w-1/2"
                onClick={handleSubmit}
                disabled={loading}
              >
                Atualizar Serviço
              </Button>
            </>
          ) : (
            <Button
              className="w-full"
              onClick={handleSubmit}
              disabled={loading}
            >
              Salvar Serviço
            </Button>
          )}
        </div>

      </div>


      {/* LISTAGEM */}
     <div className="flex justify-around items-center mt-10">
       <h2 className="text-xl font-bold mt-10 mb-4">Serviços Cadastrados</h2>

              {/* Search */}
      <div className="relative w-1/2 mx-auto">
        <SearchCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Ex: dentista"
          className="w-full pl-12 py-4 rounded-2xl shadow-lg"
        />
      </div>
     </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {filteredServices.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            variant="admin"
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}

      </div>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Excluir Serviço"
        description="Tem certeza que deseja excluir este serviço? Esta ação não pode ser desfeita."
        onConfirm={confirmDelete}
        confirmText="Excluir"
        cancelText="Cancelar"
        loading={loading}
      />
    </div>
  )
}
