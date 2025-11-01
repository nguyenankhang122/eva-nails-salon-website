"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { X } from "lucide-react"

interface Service {
  id: string
  name: string
  description: string
  price: number
  category: string
  full_set_price?: number
  fill_ins_price?: number
}

interface ServiceCategory {
  title: string
  services: Service[]
}

export default function Services() {
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase.from("services").select("*").order("category", { ascending: true })

      if (error) throw error

      // Group services by category
      const grouped = data.reduce((acc: Record<string, Service[]>, service: Service) => {
        if (!acc[service.category]) {
          acc[service.category] = []
        }
        acc[service.category].push(service)
        return acc
      }, {})

      const categories = Object.entries(grouped).map(([title, services]) => ({
        title,
        services: services as Service[],
      }))

      setServiceCategories(categories)
    } catch (error) {
      console.error("Failed to fetch services:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <section id="services" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-muted-foreground">Loading services...</p>
        </div>
      </section>
    )
  }

  const selectedCategoryData = serviceCategories.find((cat) => cat.title === selectedCategory)

  return (
    <section id="services" className="py-20 bg-background relative">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center mb-4 metallic-gold">Our Services</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Discover our comprehensive range of premium nail care and spa services
        </p>

        {/* Category Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {serviceCategories.map((category) => (
            <button
              key={category.title}
              onClick={() => setSelectedCategory(category.title)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                selectedCategory === category.title
                  ? "bg-primary text-background shadow-lg shadow-primary/50"
                  : "bg-background border-2 border-primary text-primary hover:bg-primary/10"
              }`}
            >
              {category.title}
            </button>
          ))}
        </div>

        {/* Services Tab Content */}
        {selectedCategoryData && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative border-2 border-primary/50">
              <div className="sticky top-0 bg-background border-b border-primary/50 p-6 flex justify-between items-center">
                <h3 className="text-3xl font-bold metallic-gold">{selectedCategoryData.title}</h3>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X size={28} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                {selectedCategoryData.services.map((service) => (
                  <div
                    key={service.id}
                    className="flex justify-between items-start p-4 rounded-lg hover:bg-primary/5 transition-colors duration-300 group border border-primary/20 hover:border-primary/50"
                  >
                    <div className="flex-1">
                      <p className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                        {service.name}
                      </p>
                      {service.description && (
                        <p className="text-sm text-muted-foreground mt-2">{service.description}</p>
                      )}
                    </div>
                    <div className="text-right ml-6">
                      <p className="metallic-gold font-bold text-lg">${service.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
    </section>
  )
}
