import type { Feature } from "@/types/landing";
import { motion } from "framer-motion";

export default function FeatureGrid({ features }: { features: Feature[] }) {
  return (
    <section id="features" className="container mx-auto px-4 py-12" aria-label="How it works">
      <h2 className="font-display text-3xl md:text-4xl mb-6">How it works</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {features.map((f) => (
          <motion.article
            key={f.id}
            className="rounded-lg border bg-card p-5 shadow-sm hover-scale"
            whileHover={{ y: -2 }}
          >
            <div className="flex items-start gap-3">
              <img src={f.icon} alt="" className="h-10 w-10" loading="lazy" />
              <div>
                <h3 className="text-lg font-semibold">{f.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{f.description}</p>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}