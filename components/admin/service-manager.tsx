"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, Edit2, Plus } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface Service {
  id: string
  name: string
  description: string
  price: number
  category: string
  full_set_price?: number
  fill_ins_price?: number
}

export default function ServiceManager() {
  const [services, setServices] = useState<Service[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ name: "", description: "", price: 0, category: "Manicure" })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase.from("services").select("*").order("category", { ascending: true })

      if (error) throw error
      setServices(data || [])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch services")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAdd = async () => {
    if (!formData.name || formData.price <= 0) {
      setError("Please fill in all required fields")
      return
    }

    try {
      const { data, error } = await supabase
        .from("services")
        .insert([{ ...formData }])
        .select()

      if (error) throw error
      setServices([...services, data[0]])
      setFormData({ name: "", description: "", price: 0, category: "Manicure" })
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add service")
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("services").delete().eq("id", id)

      if (error) throw error
      setServices(services.filter((s) => s.id !== id))
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete service")
    }
  }

  const handleEdit = (service: Service) => {
    setEditingId(service.id)
    setFormData({
      name: service.name,
      description: service.description,
      price: service.price,
      category: service.category,
    })
  }

  const handleUpdate = async () => {
    if (!editingId || !formData.name || formData.price <= 0) {
      setError("Please fill in all required fields")
      return
    }

    try {
      const { error } = await supabase.from("services").update(formData).eq("id", editingId)

      if (error) throw error
      setServices(services.map((s) => (s.id === editingId ? { id: editingId, ...formData } : s)))
      setEditingId(null)
      setFormData({ name: "", description: "", price: 0, category: "Manicure" })
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update service")
    }
  }

  const InputField = ({ label, ...props }: any) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <input
        {...props}
        className="w-full px-4 py-2 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
      />
    </div>
  )

  if (isLoading) {
    return <div className="text-center text-muted-foreground">Loading services...</div>
  }

  return (
    <div className="space-y-6">
      <Card className="bg-card border-border p-6">
        <h3 className="text-xl font-semibold mb-4 text-primary flex items-center gap-2">
          <Plus size={20} />
          {editingId ? "Edit Service" : "Add New Service"}
        </h3>
        {error && <p className="text-destructive text-sm mb-4">{error}</p>}
        <div className="space-y-4">
          <InputField
            label="Service Name"
            type="text"
            placeholder="e.g., Gel Manicure"
            value={formData.name}
            onChange={(e: any) => setFormData({ ...formData, name: e.target.value })}
          />
          <InputField
            label="Description"
            type="text"
            placeholder="Brief description of the service"
            value={formData.description}
            onChange={(e: any) => setFormData({ ...formData, description: e.target.value })}
          />
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            >
              <option>Manicure</option>
              <option>Pedicure</option>
              <option>Nail Enhancement</option>
              <option>Dipping Powder</option>
              <option>Waxing</option>
              <option>Additional Services</option>
            </select>
          </div>
          <InputField
            label="Price ($)"
            type="number"
            placeholder="0.00"
            value={formData.price}
            onChange={(e: any) => setFormData({ ...formData, price: Number.parseFloat(e.target.value) })}
          />
          <div className="flex gap-2 pt-2">
            {editingId ? (
              <>
                <Button onClick={handleUpdate} className="bg-primary hover:bg-primary/90">
                  Update Service
                </Button>
                <Button
                  onClick={() => {
                    setEditingId(null)
                    setFormData({ name: "", description: "", price: 0, category: "Manicure" })
                  }}
                  variant="outline"
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button onClick={handleAdd} className="bg-primary hover:bg-primary/90">
                Add Service
              </Button>
            )}
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-primary">Current Services ({services.length})</h3>
        {services.length === 0 ? (
          <Card className="bg-card border-border p-8 text-center">
            <p className="text-muted-foreground">No services yet. Add one to get started!</p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {services.map((service) => (
              <Card key={service.id} className="bg-card border-border p-4 hover:border-primary transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">{service.name}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
                    <div className="flex gap-4 mt-2">
                      <p className="text-primary font-bold">${service.price.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground bg-background px-2 py-1 rounded">
                        {service.category}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleEdit(service)}
                      variant="outline"
                      size="sm"
                      className="text-primary hover:text-primary"
                    >
                      <Edit2 size={16} />
                    </Button>
                    <Button
                      onClick={() => handleDelete(service.id)}
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
