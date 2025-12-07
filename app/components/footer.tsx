import Link from "next/link"
import { ChefHat } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <ChefHat className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">Cookio</span>
            </Link>
            <p className="mt-3 max-w-md text-sm text-muted-foreground">
              Discover delicious recipes, share your culinary creations, and connect with food lovers from around the
              world.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">Explore</h4>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/recipes" className="text-sm text-muted-foreground hover:text-foreground">
                  All Recipes
                </Link>
              </li>
              <li>
                <Link
                  href="/recipes?category=breakfast"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Breakfast
                </Link>
              </li>
              <li>
                <Link href="/recipes?category=healthy" className="text-sm text-muted-foreground hover:text-foreground">
                  Healthy
                </Link>
              </li>
              <li>
                <Link href="/recipes?category=dessert" className="text-sm text-muted-foreground hover:text-foreground">
                  Desserts
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">Account</h4>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-sm text-muted-foreground hover:text-foreground">
                  Create Account
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-sm text-muted-foreground hover:text-foreground">
                  My Profile
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Cookio. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
