"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { signIn, useSession } from "next-auth/react"
import { ArrowLeft, ChefHat, HeartHandshake, Star, Users } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const { status } = useSession()
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/")
    }
  }, [status, router])

  const handleCreateAccount = async () => {
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
              <h1 className="text-3xl font-semibold leading-tight">
                Create your <span className="text-primary">Cookio</span> profile
              </h1>
              <p className="mt-3 text-sm text-muted-foreground">
                One Google sign-in gives you full access to our cookbook, personalised feeds, and recipe sharing tools.
              </p>
            </div>
            <div className="grid gap-4">
              {[
                {
                  title: "Follow friends",
                  description: "Keep up with cooks you love and see what they are making.",
                  icon: <Users className="h-5 w-5 text-primary" />,
                },
                {
                  title: "Save favourites",
                  description: "Bookmark recipes and organise them into tidy collections.",
                  icon: <Star className="h-5 w-5 text-primary" />,
                },
                {
                  title: "Share kindness",
                  description: "Leave notes and tips to help the next cook succeed.",
                  icon: <HeartHandshake className="h-5 w-5 text-primary" />,
                },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl bg-white/70 p-4">
                  <div className="flex items-center gap-2">
                    {item.icon}
                    <p className="text-sm font-semibold">{item.title}</p>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
            <div className="mt-auto flex items-center gap-2 rounded-2xl bg-white/60 p-4 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <ChefHat className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">Free forever</p>
                <p className="text-xs text-muted-foreground">Sign in with Google—no extra passwords.</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center gap-6 p-8">
            <div>
              <h2 className="text-2xl font-semibold">Join the community</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                You only need your Google account to get started. We handle the rest.
              </p>
            </div>
            <button
              onClick={handleCreateAccount}
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
              Already signed up? <Link href="/login" className="font-medium text-primary hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
