import { Mail, Phone, MapPin, Instagram, Facebook } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-background border-t border-primary/20 py-12 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      {/* Decorative sparkles */}
      <div className="absolute top-10 left-5 w-1 h-1 bg-primary rounded-full opacity-60 animate-pulse" />
      <div
        className="absolute top-20 right-10 w-1.5 h-1.5 bg-accent rounded-full opacity-40 animate-pulse"
        style={{ animationDelay: "0.5s" }}
      />
      <div
        className="absolute bottom-20 left-1/4 w-1 h-1 bg-primary rounded-full opacity-50 animate-pulse"
        style={{ animationDelay: "1s" }}
      />
      <div
        className="absolute bottom-10 right-1/3 w-1.5 h-1.5 bg-accent rounded-full opacity-40 animate-pulse"
        style={{ animationDelay: "1.5s" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold metallic-gold mb-4">Eva Nails Salon</h3>
            <p className="text-muted-foreground text-sm">
              Experience luxury nail care in an elegant, sophisticated environment.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Hours</h4>
            <ul className="text-muted-foreground text-sm space-y-2">
              <li>Mon - Sat: 9:30 AM - 7:00 PM</li>
              <li>Sunday: Closed</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Contact</h4>
            <ul className="text-muted-foreground text-sm space-y-2">
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-primary" />
                (830) 701-8162
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={16} className="text-primary" />
                936 Junction Hwy Suite D
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-primary hover:text-accent transition-all duration-300 hover:scale-125 hover:drop-shadow-lg"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="text-primary hover:text-accent transition-all duration-300 hover:scale-125 hover:drop-shadow-lg"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="text-primary hover:text-accent transition-all duration-300 hover:scale-125 hover:drop-shadow-lg"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground text-sm">© 2025 Eva Nails Salon. All rights reserved.</p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
    </footer>
  )
}
