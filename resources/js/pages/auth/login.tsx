import { Form, Head } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { ArrowRight, Loader2 } from 'lucide-react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import MainLayout from '@/layouts/main-layout';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import { Logo } from '@/components/Logo';
type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
};

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: Props) {
    return (
        <MainLayout title="Log in to your account">
            <div className="flex min-h-screen bg-background">
                {/* Left Panel - Form */}
                <div className="flex flex-1 flex-col p-6 sm:p-8 lg:p-12">
                    <div className="mb-8 flex items-center justify-between">
                        <Link to="/">
                            <Logo size="md" />
                        </Link>
                        <Link
                            to="/signup"
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
                            <h2 className="font-display mb-2 text-2xl font-bold sm:text-3xl">
                                Welcome back
                            </h2>
                            <p className="text-muted-foreground mb-8">
                                Sign in to continue your journey
                            </p>
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
                                            <InputError
                                                message={errors.email}
                                            />
                                        </div>
                                        <div>
                                            <div className="mb-1.5 flex items-center justify-between">
                                                <Label htmlFor="password">
                                                    Password
                                                </Label>
                                                <a
                                                    href="#"
                                                    className="text-sm text-primary hover:underline"
                                                >
                                                    Forgot password?
                                                </a>
                                            </div>
                                            <Input
                                                id="password"
                                                type="password"
                                                name="password"
                                                required
                                                tabIndex={2}
                                                autoComplete="current-password"
                                                placeholder="Password"
                                            />
                                            <InputError
                                                message={errors.password}
                                            />
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

                            <div className="relative my-8">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-border" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="text-muted-foreground bg-background px-4">
                                        Or continue with
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    // disabled={isLoading}
                                >
                                    <svg
                                        className="mr-2 h-5 w-5"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                            fill="#4285F4"
                                        />
                                        <path
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                            fill="#34A853"
                                        />
                                        <path
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                            fill="#FBBC05"
                                        />
                                        <path
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                            fill="#EA4335"
                                        />
                                    </svg>
                                    Google
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    // disabled={isLoading}
                                >
                                    <svg
                                        className="mr-2 h-5 w-5"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    GitHub
                                </Button>
                            </div>
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

                            {/* Decorative Elements */}
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

            {status && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    {status}
                </div>
            )}
        </MainLayout>
    );
}
