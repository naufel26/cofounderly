import { CTA } from '@/components/landing/CTA';
import { Features } from '@/components/landing/Features';
import { Footer } from '@/components/landing/Footer';
import { HeroSection } from '@/components/landing/HeroSection';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { Navbar } from '@/components/landing/Navbar';
import { WhoItsFor } from '@/components/landing/WhoItsFor';
import MainLayout from '@/layouts/main-layout';

export default function Home() {
    return (
        <MainLayout title="Home Page">
            <div className="min-h-screen">
                <Navbar />
                <HeroSection />
                <WhoItsFor />
                <HowItWorks />
                <Features />
                <CTA />
                <Footer />
            </div>
            <div className="rounded-lg bg-white p-8 shadow-md">
                <h1 className="mb-4 text-2xl font-bold">Welcome Back!</h1>
                <p className="text-gray-600">
                    This content is wrapped inside the SimpleLayout.
                </p>
            </div>
        </MainLayout>
    );
}
