"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn, signUp } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSignIn() {
    setLoading(true)
    const { error } = await signIn(email, password)
    setLoading(false)

    if (!error) {
      router.push("/inbox")
    } else {
      alert(error.message)
    }
  }

  async function handleSignUp() {
    setLoading(true)
    const { error } = await signUp(email, password)
    setLoading(false)

    if (!error) {
      router.push("/inbox")
    } else {
      alert(error.message)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            className="w-full"
            onClick={handleSignIn}
            disabled={loading}
          >
            Sign In
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={handleSignUp}
            disabled={loading}
          >
            Create Account
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
