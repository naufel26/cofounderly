import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, Check, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import MainLayout from '@/layouts/main-layout';
// import { supabase } from '@/integrations/supabase/client';

const TOTAL_STEPS = 5;

const roleOptions = [
    {
        id: 'founder',
        label: 'Founder',
        description: 'I have a startup idea and looking to build',
    },
    {
        id: 'cofounder',
        label: 'Co-founder',
        description: 'Looking to join as a co-founder',
    },
    {
        id: 'investor',
        label: 'Investor',
        description: 'Looking to invest in startups',
    },
    {
        id: 'jobseeker',
        label: 'Job Seeker',
        description: 'Looking for startup opportunities',
    },
    {
        id: 'student',
        label: 'Student',
        description: 'Learning and exploring startups',
    },
    {
        id: 'advisor',
        label: 'Advisor',
        description: 'Offering mentorship and guidance',
    },
];

const lookingForOptions = [
    { id: 'cofounder', label: 'Cofounder', icon: '👥' },
    { id: 'team', label: 'Team Member', icon: '🧑‍💻' },
    { id: 'startup', label: 'Startup to Join', icon: '🚀' },
    { id: 'investor', label: 'Investor', icon: '💰' },
    { id: 'advisor', label: 'Advisor', icon: '🎯' },
    { id: 'mentorship', label: 'Mentorship', icon: '📚' },
    { id: 'networking', label: 'Networking', icon: '🤝' },
];

const stageOptions = [
    {
        id: 'idea',
        label: 'Idea / Concept',
        description: 'Just an idea, nothing built yet',
    },
    {
        id: 'research',
        label: 'Research & Validation',
        description: 'Validating the market',
    },
    {
        id: 'pre-revenue',
        label: 'Pre-Revenue',
        description: 'Building, no revenue yet',
    },
    {
        id: 'early-revenue',
        label: 'Early Revenue',
        description: 'First paying customers',
    },
    { id: 'launching', label: 'Launching', description: 'Product is live' },
    { id: 'growth', label: 'Growth', description: 'Scaling the business' },
    { id: 'scaling', label: 'Scaling', description: 'Rapid expansion phase' },
    {
        id: 'serial',
        label: 'Serial Entrepreneur',
        description: 'Done this before',
    },
];

const interestOptions = [
    { id: 'networking', label: 'Startup Networking' },
    { id: 'fundraising', label: 'Fundraising' },
    { id: 'investment', label: 'Investment' },
    { id: 'mentorship', label: 'Mentorship' },
    { id: 'hiring', label: 'Hiring / Jobs' },
    { id: 'mvp', label: 'Building MVP' },
    { id: 'growth', label: 'Growth & Scaling' },
];

export default function SignUp() {
    // const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    // Inertia useForm hook replaces local useState for form data
    const { data, setData, post, processing, errors } = useForm({
        fullName: '',
        email: '',
        password: '',
        tagline: '',
        role: '',
        lookingFor: [],
        stage: '',
        interests: [],
    });

    const handleInputChange = (field, value) => {
        setData(field, value);
    };

    const handleMultiSelect = (field, value) => {
        const current = data[field];
        if (current.includes(value)) {
            setData(
                field,
                current.filter((v) => v !== value),
            );
        } else {
            setData(field, [...current, value]);
        }
    };

    const handleSingleSelect = (field, value) => {
        setData(field, value);
    };

    const nextStep = () => {
        if (step < TOTAL_STEPS) setStep(step + 1);
    };
    const prevStep = () => {
        if (step > 1) setStep(step - 1);
    };

    const isStepValid = () => {
        switch (step) {
            case 1:
                return data.fullName && data.email && data.password.length >= 6;
            case 2:
                return data.role;
            case 3:
                return data.lookingFor.length > 0;
            case 4:
                return data.stage;
            case 5:
                return data.interests.length > 0;
            default:
                return false;
        }
    };

    const handleCreateAccount = () => {
        // Inertia post call to your Laravel route
        post('/user-register', {
            onSuccess: () => {
                toast({
                    title: 'Account created!',
                    description:
                        "Welcome to Cofounderly. Let's build something great!",
                });
            },
            onError: (errors) => {
                // If Laravel validation fails, Inertia maps them to the 'errors' object
                toast({
                    title: 'Error creating account',
                    description: 'Please check the form for errors.',
                    variant: 'destructive',
                });
            },
        });
    };

    return (
        <MainLayout title="Home Page">
            <div className="flex min-h-screen bg-background">
                {/* Left Panel - Form */}
                <div className="flex flex-1 flex-col p-6 sm:p-8 lg:p-12">
                    <div className="mb-8 flex items-center justify-between">
                        <Link href="/">
                            <Logo size="md" />
                        </Link>
                        <Link
                            href="/login"
                            className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                        >
                            Already have an account?{' '}
                            <span className="font-medium text-primary">
                                Sign in
                            </span>
                        </Link>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-8">
                        <div className="mb-2 flex items-center justify-between">
                            <span className="text-muted-foreground text-sm">
                                Step {step} of {TOTAL_STEPS}
                            </span>
                            <span className="text-sm font-medium">
                                {Math.round((step / TOTAL_STEPS) * 100)}%
                            </span>
                        </div>
                        <div className="bg-muted h-2 overflow-hidden rounded-full">
                            <div
                                className="bg-gradient-hero h-full transition-all duration-500 ease-out"
                                style={{
                                    width: `${(step / TOTAL_STEPS) * 100}%`,
                                }}
                            />
                        </div>
                    </div>

                    {/* Form Content */}
                    <div className="mx-auto flex w-full max-w-lg flex-1 flex-col">
                        {/* Step 1: Basic Info */}
                        {step === 1 && (
                            <div className="animate-fade-in">
                                <h2 className="font-display mb-2 text-2xl font-bold sm:text-3xl">
                                    Let's get started
                                </h2>
                                <p className="text-muted-foreground mb-8">
                                    Tell us a bit about yourself
                                </p>

                                <div className="space-y-5">
                                    <div>
                                        <Label htmlFor="fullName">
                                            Full Name
                                        </Label>
                                        <Input
                                            id="fullName"
                                            placeholder="John Doe"
                                            value={data.fullName}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    'fullName',
                                                    e.target.value,
                                                )
                                            }
                                            className="mt-1.5"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            value={data.email}
                                            onChange={(e) =>
                                                setData('email', e.target.value)
                                            }
                                        />
                                        {errors.email && (
                                            <p className="text-xs text-red-500">
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <Label htmlFor="password">
                                            Password
                                        </Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="Create a strong password (min 6 characters)"
                                            value={data.password}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    'password',
                                                    e.target.value,
                                                )
                                            }
                                            className="mt-1.5"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="tagline">
                                            Personal Tagline{' '}
                                            <span className="text-muted-foreground">
                                                (optional)
                                            </span>
                                        </Label>
                                        <Input
                                            id="tagline"
                                            placeholder="e.g., Tech founder building fintech for SMEs"
                                            value={data.tagline}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    'tagline',
                                                    e.target.value,
                                                )
                                            }
                                            className="mt-1.5"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Who Are You */}
                        {step === 2 && (
                            <div className="animate-fade-in">
                                <h2 className="font-display mb-2 text-2xl font-bold sm:text-3xl">
                                    Who are you?
                                </h2>
                                <p className="text-muted-foreground mb-8">
                                    Select the role that best describes you
                                </p>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    {roleOptions.map((option) => (
                                        <button
                                            key={option.id}
                                            onClick={() =>
                                                handleSingleSelect(
                                                    'role',
                                                    option.id,
                                                )
                                            }
                                            className={`relative rounded-xl border-2 p-5 text-left transition-all duration-200 ${
                                                data.role === option.id
                                                    ? 'shadow-card-hover border-primary bg-accent'
                                                    : 'hover:bg-muted/50 border-border hover:border-primary/50'
                                            }`}
                                        >
                                            {data.role === option.id && (
                                                <div className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                                                    <Check className="h-3 w-3 text-primary-foreground" />
                                                </div>
                                            )}
                                            <h3 className="mb-1 font-semibold">
                                                {option.label}
                                            </h3>
                                            <p className="text-muted-foreground text-sm">
                                                {option.description}
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Step 3: Looking For */}
                        {step === 3 && (
                            <div className="animate-fade-in">
                                <h2 className="font-display mb-2 text-2xl font-bold sm:text-3xl">
                                    What are you looking for?
                                </h2>
                                <p className="text-muted-foreground mb-8">
                                    Select all that apply
                                </p>

                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                    {lookingForOptions.map((option) => (
                                        <button
                                            key={option.id}
                                            onClick={() =>
                                                handleMultiSelect(
                                                    'lookingFor',
                                                    option.id,
                                                )
                                            }
                                            className={`relative rounded-xl border-2 p-4 text-center transition-all duration-200 ${
                                                data.lookingFor.includes(
                                                    option.id,
                                                )
                                                    ? 'shadow-card-hover border-primary bg-accent'
                                                    : 'hover:bg-muted/50 border-border hover:border-primary/50'
                                            }`}
                                        >
                                            {data.lookingFor.includes(
                                                option.id,
                                            ) && (
                                                <div className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary">
                                                    <Check className="h-2.5 w-2.5 text-primary-foreground" />
                                                </div>
                                            )}
                                            <span className="mb-2 block text-2xl">
                                                {option.icon}
                                            </span>
                                            <span className="text-sm font-medium">
                                                {option.label}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Step 4: Business Stage */}
                        {step === 4 && (
                            <div className="animate-fade-in">
                                <h2 className="font-display mb-2 text-2xl font-bold sm:text-3xl">
                                    What's your current stage?
                                </h2>
                                <p className="text-muted-foreground mb-8">
                                    Where are you in your startup journey?
                                </p>

                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    {stageOptions.map((option) => (
                                        <button
                                            key={option.id}
                                            onClick={() =>
                                                handleSingleSelect(
                                                    'stage',
                                                    option.id,
                                                )
                                            }
                                            className={`relative rounded-xl border-2 p-4 text-left transition-all duration-200 ${
                                                data.stage === option.id
                                                    ? 'shadow-card-hover border-primary bg-accent'
                                                    : 'hover:bg-muted/50 border-border hover:border-primary/50'
                                            }`}
                                        >
                                            {data.stage === option.id && (
                                                <div className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                                                    <Check className="h-3 w-3 text-primary-foreground" />
                                                </div>
                                            )}
                                            <h3 className="font-medium">
                                                {option.label}
                                            </h3>
                                            <p className="text-muted-foreground mt-0.5 text-xs">
                                                {option.description}
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Step 5: Interests */}
                        {step === 5 && (
                            <div className="animate-fade-in">
                                <h2 className="font-display mb-2 text-2xl font-bold sm:text-3xl">
                                    What are your interests?
                                </h2>
                                <p className="text-muted-foreground mb-8">
                                    Select topics you're interested in
                                </p>

                                <div className="flex flex-wrap gap-3">
                                    {interestOptions.map((option) => (
                                        <button
                                            key={option.id}
                                            onClick={() =>
                                                handleMultiSelect(
                                                    'interests',
                                                    option.id,
                                                )
                                            }
                                            className={`rounded-full border-2 px-5 py-3 font-medium transition-all duration-200 ${
                                                data.interests.includes(
                                                    option.id,
                                                )
                                                    ? 'border-primary bg-primary text-primary-foreground'
                                                    : 'hover:bg-muted/50 border-border hover:border-primary/50'
                                            }`}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Navigation */}
                        <div className="mt-auto flex items-center justify-between pt-8">
                            {step > 1 ? (
                                <Button
                                    variant="ghost"
                                    onClick={prevStep}
                                    disabled={isLoading}
                                >
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back
                                </Button>
                            ) : (
                                <div />
                            )}

                            {step < TOTAL_STEPS ? (
                                <Button
                                    onClick={nextStep}
                                    disabled={!isStepValid()}
                                >
                                    Continue
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            ) : (
                                <Button
                                    variant="hero"
                                    onClick={handleCreateAccount}
                                    disabled={!isStepValid() || processing}
                                >
                                    {processing ? (
                                        <Loader2 className="animate-spin" />
                                    ) : (
                                        'Create Account'
                                    )}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Panel - Visual */}
                <div className="bg-gradient-hero relative hidden overflow-hidden lg:flex lg:w-1/2">
                    <div className="hero-pattern absolute inset-0 opacity-30" />
                    <div className="absolute inset-0 flex items-center justify-center p-12">
                        <div className="text-center text-primary-foreground">
                            <h3 className="font-display mb-4 text-3xl font-bold">
                                Join Bangladesh's Startup Ecosystem
                            </h3>
                            <p className="max-w-md text-lg text-primary-foreground/80">
                                Connect with founders, investors, and talent.
                                Build your dream team and accelerate your
                                startup journey.
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
        </MainLayout>
    );
}
