import { Form, Link } from '@inertiajs/react';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import MainLayout from '@/layouts/main-layout';
import { store } from '@/routes/login';
import { Logo } from '@/components/Logo';

type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
};

function GoogleIcon() {
    return (
        <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
            <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
            />
            <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
            />
            <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                fill="#FBBC05"
            />
            <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
            />
        </svg>
    );
}

function LinkedInIcon() {
    return (
        <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true" fill="#0A66C2">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
    );
}

export default function Login({ status, canResetPassword }: Props) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <MainLayout title="Log in to your account">
            <div className="flex min-h-screen bg-background">
                {/* Left Panel - Form */}
                <div className="flex flex-1 flex-col p-6 sm:p-8 lg:p-12">
                    <div className="mb-8 flex items-center justify-between">
                        <Link href="/">
                            <Logo size="md" />
                        </Link>
                        <Link
                            href="/signup"
                            className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                        >
                            New here?{' '}
                            <span className="font-medium text-primary">
                                Create account
                            </span>
                        </Link>
                    </div>

                    <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
                        <div className="animate-fade-in">
                            {status && (
                                <div className="mb-6 rounded-lg bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                                    {status}
                                </div>
                            )}

                            <h2 className="font-display mb-2 text-2xl font-bold sm:text-3xl">
                                Welcome back
                            </h2>
                            <p className="text-muted-foreground mb-8">
                                Sign in to continue your journey
                            </p>

                            {/* Social login */}
                            <div className="mb-6 grid grid-cols-2 gap-3">
                                <a
                                    href="/auth/google/redirect"
                                    className="border-border hover:bg-muted/50 flex items-center justify-center gap-2.5 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors"
                                >
                                    <GoogleIcon />
                                    Google
                                </a>
                                <a
                                    href="/auth/linkedin/redirect"
                                    className="border-border hover:bg-muted/50 flex items-center justify-center gap-2.5 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors"
                                >
                                    <LinkedInIcon />
                                    LinkedIn
                                </a>
                            </div>

                            <div className="relative mb-6">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="border-border w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-background text-muted-foreground px-2">
                                        Or sign in with email
                                    </span>
                                </div>
                            </div>

                            <Form
                                {...store.form()}
                                resetOnSuccess={['password']}
                                className="space-y-5"
                            >
                                {({ processing, errors }) => (
                                    <>
                                        <div>
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                name="email"
                                                required
                                                autoFocus
                                                tabIndex={1}
                                                autoComplete="email"
                                                placeholder="email@example.com"
                                                className="mt-1.5"
                                            />
                                            <InputError message={errors.email} />
                                        </div>
                                        <div>
                                            <div className="mb-1.5 flex items-center justify-between">
                                                <Label htmlFor="password">
                                                    Password
                                                </Label>
                                                {canResetPassword && (
                                                    <Link
                                                        href="/forgot-password"
                                                        className="text-sm text-primary hover:underline"
                                                    >
                                                        Forgot password?
                                                    </Link>
                                                )}
                                            </div>
                                            <div className="relative">
                                                <Input
                                                    id="password"
                                                    type={showPassword ? 'text' : 'password'}
                                                    name="password"
                                                    required
                                                    tabIndex={2}
                                                    autoComplete="current-password"
                                                    placeholder="Password"
                                                    className="pr-10"
                                                />
                                                <button
                                                    type="button"
                                                    tabIndex={-1}
                                                    onClick={() => setShowPassword((v) => !v)}
                                                    className="text-muted-foreground hover:text-foreground absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                                >
                                                    {showPassword ? (
                                                        <EyeOff className="h-4 w-4" />
                                                    ) : (
                                                        <Eye className="h-4 w-4" />
                                                    )}
                                                </button>
                                            </div>
                                            <InputError message={errors.password} />
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <Checkbox
                                                id="remember"
                                                name="remember"
                                                tabIndex={3}
                                            />
                                            <Label htmlFor="remember">
                                                Remember me
                                            </Label>
                                        </div>
                                        <Button
                                            type="submit"
                                            className="mt-4 w-full"
                                            size="lg"
                                            tabIndex={4}
                                            disabled={processing}
                                            data-test="login-button"
                                        >
                                            {processing && <Spinner />}
                                            Log in
                                        </Button>
                                    </>
                                )}
                            </Form>

                            <p className="text-muted-foreground mt-8 text-center text-sm">
                                Don't have an account?{' '}
                                <Link href="/signup" className="font-medium text-primary hover:underline">
                                    Sign up for free
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Panel - Visual */}
                <div className="bg-gradient-hero relative hidden overflow-hidden lg:flex lg:w-1/2">
                    <div className="hero-pattern absolute inset-0 opacity-30" />
                    <div className="absolute inset-0 flex items-center justify-center p-12">
                        <div className="text-center text-primary-foreground">
                            <h3 className="font-display mb-4 text-3xl font-bold">
                                Your Startup Journey Continues
                            </h3>
                            <p className="max-w-md text-lg text-primary-foreground/80">
                                Pick up right where you left off. Your
                                connections, teams, and opportunities are
                                waiting.
                            </p>

                            <div className="mt-12 flex justify-center gap-4">
                                <div className="animate-float h-20 w-20 rounded-2xl border border-primary-foreground/20 bg-primary-foreground/10 backdrop-blur-sm" />
                                <div
                                    className="animate-float h-20 w-20 rounded-2xl border border-primary-foreground/20 bg-primary-foreground/10 backdrop-blur-sm"
                                    style={{ animationDelay: '-1s' }}
                                />
                                <div
                                    className="animate-float h-20 w-20 rounded-2xl border border-primary-foreground/20 bg-primary-foreground/10 backdrop-blur-sm"
                                    style={{ animationDelay: '-2s' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
