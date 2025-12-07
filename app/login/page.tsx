"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { signIn, useSession } from "next-auth/react"
import { ArrowLeft, CheckCircle2, ChefHat, ShieldCheck } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const { status } = useSession()
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/")
    }
  }, [status, router])

  const handleLogin = async () => {
    try {
      setSubmitting(true)
      await signIn("google", { callbackUrl: "/" })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-muted/30 px-4 py-10">
      <div className="w-full max-w-4xl overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
        <div className="grid gap-0 md:grid-cols-2">
          <div className="flex flex-col gap-6 bg-primary/5 p-8">
            <Link href="/" className="flex items-center gap-2 text-sm font-medium text-primary hover:underline">
              <ArrowLeft className="h-4 w-4" />
              Back home
            </Link>
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
                <ShieldCheck className="h-3.5 w-3.5" />
                Google secured
              </div>
              <h1 className="mt-4 text-3xl font-semibold leading-tight">
                Welcome back to <span className="text-primary">Cookio</span>
              </h1>
              <p className="mt-3 text-sm text-muted-foreground">
                Sign in with your Google account to save recipes, share your creations, and sync favorites across devices.
              </p>
            </div>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {["Access personalised recommendations", "Publish and manage your own recipes", "Sync your cookbook across devices"].map(
                (item) => (
                  <li key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    {item}
                  </li>
                ),
              )}
            </ul>
            <div className="mt-auto flex items-center gap-2 rounded-2xl bg-white/60 p-4 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <ChefHat className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">Loved by 50k+ home cooks</p>
                <p className="text-xs text-muted-foreground">Join the community in a single click.</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center gap-6 p-8">
            <div>
              <h2 className="text-2xl font-semibold">Sign in to your account</h2>
              <p className="mt-2 text-sm text-muted-foreground">Use your Google account to jump back into your saved recipes.</p>
            </div>
            <button
              onClick={handleLogin}
              disabled={submitting || status === "loading"}
              className="inline-flex items-center justify-center gap-3 rounded-xl bg-primary px-4 py-3 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true" role="img">
                <path
                  d="M21.35 11.1h-9.17v2.92h5.58c-.24 1.4-1.67 4.12-5.58 4.12a6.44 6.44 0 1 1 0-12.88 6.18 6.18 0 0 1 4.36 1.7l2.06-1.99A9.18 9.18 0 0 0 12.18 2.5a9.5 9.5 0 1 0 0 19c5.48 0 9.07-3.85 9.07-9.26 0-.62-.06-1.1-.1-1.14Z"
                  fill="currentColor"
                />
              </svg>
              Continue with Google
            </button>
            <p className="text-center text-sm text-muted-foreground">
              New to Cookio? <Link href="/register" className="font-medium text-primary hover:underline">Create an account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
