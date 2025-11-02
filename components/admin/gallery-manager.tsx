"use client"

import React, { useState, useEffect, useCallback, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, Edit2, Plus, ChevronDown, ChevronUp } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

interface GalleryImage {
  id: string
  title: string
  description: string
  image_url: string
  category: string
  display_order: number
}

// Memoized InputField
const InputField = React.memo(
  ({
    label,
    value,
    onChange,
    type = "text",
    placeholder = "",
  }: {
    label: string
    value: string
    onChange: (val: string) => void
    type?: string
    placeholder?: string
  }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
      />
    </div>
  ),
)

export default function GalleryManager() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image_url: "",
    category: "Manicure",
    display_order: "",
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [openCategories, setOpenCategories] = useState<string[]>([])
  const formRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchImages()
  }, [])

  const fetchImages = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase.from("gallery_images").select("*").order("category", { ascending: true })

      if (error) throw error
      setImages(data || [])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch gallery images")
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setEditingId(null)
    setFormData({
      title: "",
      description: "",
      image_url: "",
      category: "Manicure",
      display_order: "",
    })
    setError(null)
  }

  const handleFieldChange = useCallback((field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }, [])

  const handleAdd = async () => {
    const displayOrder = formData.display_order ? Number.parseInt(formData.display_order) : 0

    if (!formData.title || !formData.image_url) {
      setError("Please fill in title and image URL")
      return
    }

    try {
      const { data, error } = await supabase
        .from("gallery_images")
        .insert([
          {
            ...formData,
            display_order: displayOrder,
          },
        ])
        .select()

      if (error) throw error
      setImages((prev) => [...prev, data[0]])
      resetForm()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add gallery image")
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("gallery_images").delete().eq("id", id)
      if (error) throw error
      setImages((prev) => prev.filter((img) => img.id !== id))
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete gallery image")
    }
  }

  const handleEdit = (image: GalleryImage) => {
    setEditingId(image.id)
    setFormData({
      title: image.title,
      description: image.description || "",
      image_url: image.image_url,
      category: image.category,
      display_order: image.display_order.toString(),
    })

    if (formRef.current) {
      const yOffset = -80
      const y = formRef.current.getBoundingClientRect().top + window.scrollY + yOffset
      window.scrollTo({ top: y, behavior: "smooth" })
    }
  }

  const handleUpdate = async () => {
    if (!editingId) return
    const displayOrder = formData.display_order ? Number.parseInt(formData.display_order) : 0

    if (!formData.title || !formData.image_url) {
      setError("Please fill in title and image URL")
      return
    }

    try {
      const { error } = await supabase
        .from("gallery_images")
        .update({
          ...formData,
          display_order: displayOrder,
        })
        .eq("id", editingId)

      if (error) throw error
      setImages((prev) =>
        prev.map((img) => (img.id === editingId ? { id: editingId, ...formData, display_order: displayOrder } : img)),
      )
      resetForm()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update gallery image")
    }
  }

  const toggleCategory = (category: string) => {
    setOpenCategories((prev) => (prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]))
  }

  if (isLoading) return <div className="text-center text-muted-foreground">Loading gallery images...</div>

  // Group images by category
  const categories = Array.from(new Set(images.map((img) => img.category)))
  const groupedImages = categories.map((category) => ({
    category,
    images: images.filter((img) => img.category === category),
  }))

  return (
    <div className="space-y-6">
      {/* Form Card */}
      <Card ref={formRef} className="bg-card border-border p-6">
        <h3 className="text-xl font-semibold mb-4 text-primary flex items-center gap-2">
          <Plus size={20} /> {editingId ? "Edit Gallery Image" : "Add New Gallery Image"}
        </h3>

        {error && <p className="text-destructive text-sm mb-4">{error}</p>}

        <div className="space-y-4">
          <InputField
            label="Image Title"
            value={formData.title}
            onChange={(val) => handleFieldChange("title", val)}
            placeholder="e.g., Gold Glitter Nails"
          />
          <InputField
            label="Description"
            value={formData.description}
            onChange={(val) => handleFieldChange("description", val)}
            placeholder="Brief description of the image"
          />
          <InputField
            label="Image URL"
            value={formData.image_url}
            onChange={(val) => handleFieldChange("image_url", val)}
            placeholder="https://example.com/image.jpg"
          />
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Category</label>
            <select
              value={formData.category}
              onChange={(e) => handleFieldChange("category", e.target.value)}
              className="w-full px-4 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            >
              <option>Manicure</option>
              <option>Pedicure</option>
              <option>Nail Enhancement</option>
              <option>Dipping Powder</option>
              <option>Waxing</option>
              <option>Other</option>
            </select>
          </div>
          <InputField
            label="Display Order"
            type="number"
            value={formData.display_order}
            onChange={(val) => handleFieldChange("display_order", val)}
            placeholder="0"
          />

          <div className="flex gap-2 pt-2">
            {editingId ? (
              <>
                <Button onClick={handleUpdate} className="bg-primary hover:bg-primary/90">
                  Update Image
                </Button>
                <Button onClick={resetForm} variant="outline">
                  Cancel
                </Button>
              </>
            ) : (
              <Button onClick={handleAdd} className="bg-primary hover:bg-primary/90">
                Add Image
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Images List */}
      <div className="space-y-4">
        {groupedImages.map(({ category, images }) => (
          <div key={category}>
            <button
              onClick={() => toggleCategory(category)}
              className="flex justify-between w-full px-4 py-2 bg-primary/10 text-primary font-semibold rounded-md hover:bg-primary/20 transition-colors"
            >
              {category} ({images.length})
              {openCategories.includes(category) ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            {openCategories.includes(category) && (
              <div className="mt-2 grid gap-3">
                {images.map((image) => (
                  <Card
                    key={image.id}
                    className="bg-card border-border p-4 flex justify-between items-start hover:border-primary hover:shadow-md transition-all rounded-lg"
                  >
                    <div className="flex-1 flex gap-4">
                      <img
                        src={image.image_url || "/placeholder.svg"}
                        alt={image.title}
                        className="w-20 h-20 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">{image.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1 truncate" title={image.description}>
                          {image.description || "No description"}
                        </p>
                        <div className="flex gap-2 mt-2 flex-wrap items-center">
                          <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
                            Order: {image.display_order}
                          </span>
                          <span className="bg-background text-muted-foreground px-2 py-1 rounded-full text-xs">
                            {image.category}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleEdit(image)}
                        variant="outline"
                        size="sm"
                        className="text-primary hover:text-primary"
                      >
                        <Edit2 size={16} />
                      </Button>
                      <Button
                        onClick={() => handleDelete(image.id)}
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
