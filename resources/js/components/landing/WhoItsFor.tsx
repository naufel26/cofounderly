import { 
  Lightbulb, 
  TrendingUp, 
  Briefcase, 
  GraduationCap, 
  Users2 
} from "lucide-react";

const personas = [
  {
    icon: Lightbulb,
    title: "Founders",
    description: "Turn your vision into reality by finding the perfect co-founder who complements your skills.",
    color: "bg-accent text-primary",
  },
  {
    icon: TrendingUp,
    title: "Investors",
    description: "Discover promising startups and founding teams early. Be part of the next big success story.",
    color: "bg-brand-coral-light text-secondary",
  },
  {
    icon: Briefcase,
    title: "Job Seekers",
    description: "Join exciting startups at the ground floor. Find roles that offer growth and equity.",
    color: "bg-accent text-primary",
  },
  {
    icon: GraduationCap,
    title: "Students",
    description: "Start your entrepreneurial journey early. Learn, connect, and build alongside experienced founders.",
    color: "bg-brand-coral-light text-secondary",
  },
  {
    icon: Users2,
    title: "Advisors",
    description: "Share your expertise with the next generation of founders. Mentor and guide promising teams.",
    color: "bg-accent text-primary",
  },
];

export function WhoItsFor() {
  return (
    <section id="who-its-for" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent text-primary text-sm font-medium mb-4">
            Who It's For
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-4">
            One Platform, Many Opportunities
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Whether you're building, investing, or joining — Cofounderly connects you with the right people.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {personas.map((persona, index) => (
            <div
              key={persona.title}
              className="group relative bg-card rounded-2xl p-6 border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-14 h-14 rounded-xl ${persona.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <persona.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{persona.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {persona.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
