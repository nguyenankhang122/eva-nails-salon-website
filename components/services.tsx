"use client"

import { useEffect, useState } from "react"

interface ServiceCategory {
  title: string
  description?: string
  services: {
    name: string
    price: string | { fullSet?: string; fillIns?: string }
  }[]
  image?: string
}

const serviceCategories: ServiceCategory[] = [
  {
    title: "Pedicure",
    services: [
      { name: "Basic Spa Pedicure", price: "$35" },
      { name: "Relax Spa Pedicure", price: "$45" },
      { name: "Collagen Spa Pedicure", price: "$55" },
      { name: "Deluxe Spa Pedicure", price: "$65" },
      { name: "Kid's Pedicure", price: "$25" },
    ],
  },
  {
    title: "Manicure",
    services: [
      { name: "Classic Manicure with Regular Polish", price: "$20" },
      { name: "Gel Manicure", price: "$35" },
      { name: "Kid's Manicure", price: "$15" },
      { name: "Polish Change with Trim & Shape", price: "$10" },
      { name: "Gel Polish Change with Trim & Shape", price: "$20" },
    ],
  },
  {
    title: "Nail Enhancement",
    services: [
      { name: "Gel Polish", price: { fullSet: "$50", fillIns: "$45" } },
      { name: "Color Powder", price: { fullSet: "$50", fillIns: "$45" } },
      { name: "Ombre", price: { fullSet: "$65", fillIns: "$60" } },
      { name: "Pink & White", price: { fullSet: "$60", fillIns: "$55" } },
      { name: "White Tip", price: { fullSet: "$50", fillIns: "$40" } },
      { name: "Regular Polish", price: { fullSet: "$40", fillIns: "$35" } },
    ],
  },
  {
    title: "Dipping Powder",
    services: [
      { name: "Dip Color", price: "$50" },
      { name: "Dip Ombre", price: "$65" },
      { name: "Dip French", price: "$60" },
    ],
  },
  {
    title: "Waxing",
    services: [
      { name: "Eyebrows", price: "$10" },
      { name: "Upper Lip", price: "$7" },
      { name: "Chin", price: "$8" },
      { name: "Underarm Wax", price: "$20" },
      { name: "Full Face", price: "$40" },
      { name: "Arms", price: "$40" },
      { name: "Half Leg", price: "$40" },
      { name: "Full Leg", price: "$80" },
    ],
  },
  {
    title: "Additional Services",
    services: [
      { name: "Removal", price: "$5" },
      { name: "Extra Design (Simple)", price: "$10+" },
      { name: "Chrome", price: "$15" },
      { name: "French (Classic)", price: "$5" },
      { name: "French (Pink & White)", price: "$10" },
      { name: "Cat Eye (Depending on Design)", price: "$10+" },
    ],
  },
]

export default function Services() {
  const [visibleCategories, setVisibleCategories] = useState<number[]>([])

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
                  {category.services.map((service, serviceIndex) => (
                    <div
                      key={serviceIndex}
                      className="flex justify-between items-start p-3 rounded-lg hover:bg-primary/5 transition-colors duration-300 group"
                    >
                      <div className="flex-1">
                        <p className="text-foreground group-hover:text-primary transition-colors duration-300">
                          {service.name}
                        </p>
                      </div>
                      <div className="text-right ml-4">
                        {typeof service.price === "string" ? (
                          <p className="metallic-gold font-semibold">{service.price}</p>
                        ) : (
                          <div className="text-sm">
                            {service.price.fullSet && (
                              <p className="metallic-gold font-semibold">{service.price.fullSet}</p>
                            )}
                            {service.price.fillIns && (
                              <p className="text-muted-foreground text-xs">{service.price.fillIns}</p>
                            )}
                          </div>
                        )}
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
