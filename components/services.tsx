"use client"

import { useEffect, useState } from "react"
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

interface ServiceCategory {
  title: string
  services: Service[]
}

export default function Services() {
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([])
  const [visibleCategories, setVisibleCategories] = useState<number[]>([])
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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = Number(entry.target.getAttribute("data-category-id"))
            setVisibleCategories((prev) => [...new Set([...prev, id])])
          }
        })
      },
      { threshold: 0.1 },
    )

    document.querySelectorAll("[data-service-category]").forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  if (isLoading) {
    return (
      <section id="services" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-muted-foreground">Loading services...</p>
        </div>
      </section>
    )
  }

  return (
    <section id="services" className="py-20 bg-background relative">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center mb-4 metallic-gold">Our Services</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Discover our comprehensive range of premium nail care and spa services
        </p>

        <div className="space-y-12">
          {serviceCategories.map((category, categoryIndex) => (
            <div
              key={categoryIndex}
              data-category-id={categoryIndex}
              data-service-category
              className={`transition-all duration-500 ${
                visibleCategories.includes(categoryIndex) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{
                transitionDelay: `${categoryIndex * 100}ms`,
              }}
            >
              <h3 className="text-3xl font-bold metallic-gold mb-6 text-center">{category.title}</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Services List */}
                <div className="space-y-3">
                  {category.services.map((service) => (
                    <div
                      key={service.id}
                      className="flex justify-between items-start p-3 rounded-lg hover:bg-primary/5 transition-colors duration-300 group"
                    >
                      <div className="flex-1">
                        <p className="text-foreground group-hover:text-primary transition-colors duration-300">
                          {service.name}
                        </p>
                        {service.description && (
                          <p className="text-xs text-muted-foreground mt-1">{service.description}</p>
                        )}
                      </div>
                      <div className="text-right ml-4">
                        <p className="metallic-gold font-semibold">${service.price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Decorative Image or Placeholder */}
                <div className="flex items-center justify-center">
                  <div className="w-full h-64 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center border border-primary/20">
                    <div className="text-center">
                      <p className="text-primary/60 text-sm">{category.title} Services</p>
                      <p className="text-primary/40 text-xs mt-2">Premium Quality</p>
                    </div>
                  </div>
                </div>
              </div>

              {categoryIndex < serviceCategories.length - 1 && (
                <div className="mt-12 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
    </section>
  )
}
