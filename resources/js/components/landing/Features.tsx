import { 
  Users, 
  MessageSquare, 
  Building2, 
  Sparkles, 
  Shield, 
  Globe 
} from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Smart Matching",
    description: "AI-powered compatibility scoring finds co-founders who complement your skills and share your vision.",
  },
  {
    icon: MessageSquare,
    title: "Social Feed",
    description: "Share updates, ask for advice, and engage with the startup community. Build your reputation.",
  },
  {
    icon: Building2,
    title: "Startup Teams",
    description: "Form and manage your founding team. Define roles, invite members, and collaborate seamlessly.",
  },
  {
    icon: Sparkles,
    title: "Advisor Network",
    description: "Connect with experienced advisors and mentors. Get guidance from those who've been there.",
  },
  {
    icon: Shield,
    title: "Verified Profiles",
    description: "Trust-building verification system ensures you're connecting with serious, committed individuals.",
  },
  {
    icon: Globe,
    title: "Bangladesh First",
    description: "Built for the Bangladeshi startup ecosystem while connecting you to global opportunities.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent text-primary text-sm font-medium mb-4">
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-4">
            Everything You Need to Build Your Dream Team
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful tools designed for founders who are serious about building successful startups.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group bg-card rounded-2xl p-8 border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-card-hover"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-hero flex items-center justify-center mb-6 group-hover:shadow-glow transition-shadow">
                <feature.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
