import { Form } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
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

export default function Login({ status, canResetPassword }: Props) {
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
                                            <Input
                                                id="password"
                                                type="password"
                                                name="password"
                                                required
                                                tabIndex={2}
                                                autoComplete="current-password"
                                                placeholder="Password"
                                            />
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
