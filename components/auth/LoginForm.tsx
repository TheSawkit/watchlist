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
import { login } from "@/app/auth/actions"
import { createClient } from "@/lib/supabase/client"
import { useTranslation } from "@/lib/i18n/context"

const initialState = { error: '' }

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
    const [state, formAction, isPending] = useActionState(login, initialState)
    const { t } = useTranslation()
    const supabase = createClient()

    const handleOAuthLogin = async (provider: 'google') => {
        await supabase.auth.signInWithOAuth({
            provider,
            options: { redirectTo: `${location.origin}/auth/callback` },
        })
    }

    return (
        <div
            className={cn("flex flex-col gap-6", className)}
            {...props}
            style={{ animation: "scaleIn 0.5s ease-out forwards", opacity: 0 }}
        >
            <Card className="transform transition-all duration-300 hover:shadow-lg">
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">{t.auth.login.title}</CardTitle>
                    <CardDescription>{t.auth.login.description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={formAction}>
                        <FieldGroup>
                            <Field>
                                <Button
                                    variant="outline"
                                    type="button"
                                    onClick={() => handleOAuthLogin('google')}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <path
                                            d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                                            fill="currentColor"
                                        />
                                    </svg>
                                    {t.auth.login.google}
                                </Button>
                            </Field>
                            <FieldSeparator>{t.auth.login.orEmail}</FieldSeparator>
                            <Field>
                                <FieldLabel htmlFor="email">{t.auth.login.email}</FieldLabel>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="chuck@example.com"
                                    required
                                />
                            </Field>
                            <Field>
                                <div className="flex items-center">
                                    <FieldLabel htmlFor="password">{t.auth.login.password}</FieldLabel>
                                    <a
                                        href="#"
                                        className="ml-auto text-sm underline-offset-4 hover:underline"
                                    >
                                        {t.auth.login.forgotPassword}
                                    </a>
                                </div>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    required
                                />
                            </Field>
                            {state?.error && (
                                <p className="text-sm text-red-2 text-center">{state.error}</p>
                            )}
                            <Field>
                                <Button type="submit" disabled={isPending}>
                                    {isPending ? t.common.loading : t.auth.login.button}
                                </Button>
                                <FieldDescription className="text-center">
                                    {t.auth.login.dontHaveAccount}{" "}
                                    <Link href="/signup">{t.auth.login.signup}</Link>
                                </FieldDescription>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
            <FieldDescription className="px-6 text-center">
                {t.auth.terms}{" "}
                <a href="#">{t.auth.termsLink}</a> {t.common.and}{" "}
                <a href="#">{t.auth.privacyLink}</a>.
            </FieldDescription>
        </div>
    )
}
