"use client"

import { useEffect, useState } from "react"
import CategoriesManager from "./components/CategoriesManager"
import ServicesManager from "./components/ServicesManager"

type Category = {
  id: string
  name: string
}

export default function AdminPage() {
  const [categories, setCategories] = useState<Category[]>([])

  function loadCategories() {
    fetch("/api/categories")
      .then(res => res.json())
      .then(setCategories)
  }

  useEffect(() => {
    loadCategories()
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 space-y-10 mt-10">
      <h1 className="text-2xl font-bold text-center">Painel Administrativo</h1>

      <div className=" gap-10">
        <CategoriesManager onChange={loadCategories} />
        <ServicesManager categories={categories} />
      </div>
    </div>
  )
}
