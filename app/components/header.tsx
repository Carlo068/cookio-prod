"use client"

import Link from "next/link"
import { useSession, signIn, signOut } from "next-auth/react"
import { useState } from "react"
import { Menu, X, ChefHat, User, LogOut, Plus, BookOpen } from "lucide-react"

export function Header() {
  const { data: session, status } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const handleGoogleAuth = () => signIn("google", { callbackUrl: "/" })

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <ChefHat className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold tracking-tight">Cookio</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/recipes"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Recipes
          </Link>
          {status === "authenticated" && (
            <Link
              href="/recipes/create"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Create Recipe
            </Link>
          )}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          {status === "loading" ? (
            <div className="h-9 w-20 animate-pulse rounded-lg bg-muted" />
          ) : status === "authenticated" ? (
            <div className="flex items-center gap-3">
              <Link
                href="/recipes/create"
                className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <Plus className="h-4 w-4" />
                New Recipe
              </Link>
              <div className="relative group">
                <button className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted">
                  <User className="h-4 w-4" />
                  {session.user?.name?.split(" ")[0] || "Account"}
                </button>
                <div className="absolute right-0 top-full mt-2 hidden w-48 rounded-lg border border-border bg-card p-2 shadow-lg group-hover:block">
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    <BookOpen className="h-4 w-4" />
                    My Profile
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={handleGoogleAuth}
                className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Sign In
              </button>
              <button
                onClick={handleGoogleAuth}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Get Started
              </button>
            </div>
          )}
        </div>

        <button className="rounded-lg p-2 md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-border bg-background px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            <Link
              href="/recipes"
              className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted"
              onClick={() => setMobileMenuOpen(false)}
            >
              Recipes
            </Link>
            {status === "authenticated" ? (
              <>
                <Link
                  href="/recipes/create"
                  className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Create Recipe
                </Link>
                <Link
                  href="/profile"
                  className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Profile
                </Link>
                <button
                  onClick={() => {
                    signOut()
                    setMobileMenuOpen(false)
                  }}
                  className="rounded-lg px-3 py-2 text-left text-sm font-medium text-destructive hover:bg-muted"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false)
                    handleGoogleAuth()
                  }}
                  className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false)
                    handleGoogleAuth()
                  }}
                  className="rounded-lg bg-primary px-3 py-2 text-center text-sm font-medium text-primary-foreground"
                >
                  Get Started
                </button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
