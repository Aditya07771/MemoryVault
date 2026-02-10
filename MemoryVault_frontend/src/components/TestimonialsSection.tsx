import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Marquee } from "@/components/ui/marquee";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    name: "Sarah Chen",
    username: "@sarah.lens",
    body: "LifeVault changed how I think about digital memories. For the first time, I feel like I truly own my life's story.",
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
  },
  {
    name: "Marcus Williams",
    username: "@marcus_w",
    body: "The security features are incredible. As someone who works in tech, I appreciate the zero-knowledge architecture.",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
  },
  {
    name: "Elena Rodriguez",
    username: "@elenar_89",
    body: "I've been able to organize 30 years of family photos and documents. The timeline feature is simply beautiful.",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
  },
  {
    name: "David Park",
    username: "@david_p",
    body: "Finally, a place where I can store my children's milestones without worrying about privacy policies changing.",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
  },
  {
    name: "James Wilson",
    username: "@jwilson",
    body: "The social recovery feature gives me peace of mind. I know my family will have access to my legacy when I'm gone.",
    img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
  },
  {
    name: "Anita Patel",
    username: "@anita_art",
    body: "Beautiful interface, solid security, and it just works. Best subscription I've made this year.",
    img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
  },
];

const firstRow = testimonials.slice(0, testimonials.length / 2);
const secondRow = testimonials.slice(testimonials.length / 2);

const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string;
  name: string;
  username: string;
  body: string;
}) => {
  return (
    <figure
      className={cn(
        "relative w-80 cursor-pointer overflow-hidden rounded-xl border p-6 mx-4",
        // light styles (default now)
        "border-black/5 bg-white hover:bg-black/[0.02] shadow-sm transition-colors",
      )}
    >
      <div className="flex flex-row items-center gap-3">
        <img className="rounded-full object-cover" width="40" height="40" alt="" src={img} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-semibold text-black">
            {name}
          </figcaption>
          <p className="text-xs font-medium text-black/40">{username}</p>
        </div>
      </div>
      <blockquote className="mt-4 text-sm text-black/70 leading-relaxed">{body}</blockquote>
    </figure>
  );
};

export function TestimonialsSection() {
  return (
    <section className="relative py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 lg:px-20 mb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="section-label">TESTIMONIALS</span>
          <h2 className="section-heading mt-4">Loved by Thousands</h2>
        </motion.div>
      </div>

      <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden">
        <Marquee pauseOnHover className="[--duration:40s]">
          {firstRow.map((review) => (
            <ReviewCard key={review.username} {...review} />
          ))}
        </Marquee>
        <Marquee reverse pauseOnHover className="[--duration:40s] mt-8">
          {secondRow.map((review) => (
            <ReviewCard key={review.username} {...review} />
          ))}
        </Marquee>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-white dark:from-background"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-white dark:from-background"></div>
      </div>
    </section>
  );
}
