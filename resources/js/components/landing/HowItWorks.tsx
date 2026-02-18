import { UserPlus, Search, MessageCircle, Rocket } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Create Your Profile",
    description: "Tell us who you are, what you're building, and what you're looking for. Our smart onboarding captures your unique journey.",
  },
  {
    icon: Search,
    step: "02",
    title: "Discover & Match",
    description: "Browse founders, investors, and talent. Our AI suggests compatible matches based on skills, stage, and goals.",
  },
  {
    icon: MessageCircle,
    step: "03",
    title: "Connect & Collaborate",
    description: "Send connection requests, chat directly, and join startup teams. Build relationships that matter.",
  },
  {
    icon: Rocket,
    step: "04",
    title: "Build Together",
    description: "Form your dream team, access advisors, and accelerate your startup journey from idea to launch.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-brand-coral-light text-secondary text-sm font-medium mb-4">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-4">
            Your Startup Journey in 4 Simple Steps
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From profile creation to team formation — we've simplified the process of finding your perfect co-founder.
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-24 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-primary via-secondary to-primary opacity-20" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={step.step} className="relative group">
                {/* Step Number */}
                <div className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-gradient-hero text-primary-foreground text-xs font-bold z-10">
                  Step {step.step}
                </div>

                <div className="bg-card rounded-2xl p-6 pt-8 border border-border h-full hover:border-primary/30 transition-all duration-300 hover:shadow-card-hover group-hover:-translate-y-1">
                  <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center mb-5 group-hover:bg-primary/10 transition-colors">
                    <step.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
