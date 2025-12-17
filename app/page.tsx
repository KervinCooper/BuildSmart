import { Button } from "@/components/ui/button"
import Link from "next/link"
import { HardHat, Package, BarChart3, Users } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-600 p-2 rounded-lg">
              <HardHat className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">BuildSmart</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button asChild variant="ghost">
              <Link href="/auth/login">Sign in</Link>
            </Button>
            <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
              <Link href="/auth/signup">Get started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            The Digital Marketplace for <span className="text-emerald-600">Smart Builders</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Streamline your construction projects with real-time material pricing, inventory tracking, and project
            management tools designed for small builders.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700 h-12 px-8">
              <Link href="/auth/signup">Start free trial</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12 px-8 bg-transparent">
              <Link href="#features">Learn more</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything you need to build smarter</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From material sourcing to project completion, BuildSmart provides the tools to manage your construction
              business efficiently.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6">
              <div className="bg-emerald-100 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Package className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Material Marketplace</h3>
              <p className="text-gray-600">
                Compare prices from multiple suppliers and find the best deals on construction materials.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-amber-100 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Inventory Tracking</h3>
              <p className="text-gray-600">
                Track materials in real-time with automated alerts for low stock and reorder points.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-emerald-100 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                <HardHat className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Project Management</h3>
              <p className="text-gray-600">
                Organize tasks, track progress, and manage timelines for all your construction projects.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-amber-100 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Team Collaboration</h3>
              <p className="text-gray-600">
                Connect with suppliers, manage orders, and collaborate with your team in one platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-emerald-600 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to build smarter?</h2>
          <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
            Join thousands of builders who are already using BuildSmart to streamline their construction projects and
            save money.
          </p>
          <Button asChild size="lg" variant="secondary" className="h-12 px-8">
            <Link href="/auth/signup">Get started today</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="bg-emerald-600 p-2 rounded-lg">
              <HardHat className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold">BuildSmart</span>
          </div>
          <p className="text-gray-400">© 2024 BuildSmart. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
