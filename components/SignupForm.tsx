'use client'

import { useActionState } from 'react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { signup } from "@/app/auth/actions"
import { createClient } from "@/lib/supabase/client"

const initialState = {
  error: '',
}

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [state, formAction, isPending] = useActionState(signup, initialState)
  const supabase = createClient()

  const handleOAuthLogin = async (provider: 'google') => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    })
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">
            Prêt·e pour la séance ?
          </CardTitle>
          <CardDescription>
            Rentrez en scène et créez votre compte
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction}>
            <FieldGroup>
              <Field>
                <Button variant="outline" type="button" onClick={() => handleOAuthLogin('google')}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  S&apos;inscrire avec Google
                </Button>
              </Field>
              <FieldSeparator>
                Ou continuer avec votre email
              </FieldSeparator>
              <Field>
                <FieldLabel htmlFor="username">Pseudo</FieldLabel>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="chuck_norris"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">E-mail</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="chuck@exemple.com"
                  required
                />
              </Field>
              <Field>
                <Field className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="password">Mot de passe</FieldLabel>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="********"
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="confirm-password" className="whitespace-nowrap">
                      Confirmation
                    </FieldLabel>
                    <Input
                      id="confirm-password"
                      name="confirm-password"
                      type="password"
                      placeholder="********"
                      required
                    />
                  </Field>
                </Field>
                <FieldDescription>
                  Doit contenir au moins 8 caractères.
                </FieldDescription>
              </Field>
              {state?.error && (
                <p className="text-sm text-red-500 text-center">{state.error}</p>
              )}
              <Field>
                <Button type="submit" disabled={isPending}>
                  {isPending ? 'Création...' : 'Créer mon compte'}
                </Button>
                <FieldDescription className="text-center">
                  Déjà un compte ? <Link href="/login">Se connecter</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        En continuant, vous acceptez nos{" "}
        <a href="#">Conditions d&apos;utilisation</a> et notre{" "}
        <a href="#">Politique de confidentialité</a>.
      </FieldDescription>
    </div>
  )
}
