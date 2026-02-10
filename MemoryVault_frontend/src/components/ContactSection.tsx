// import { motion } from "framer-motion";
// import { Mail, MessageCircle, Send } from "lucide-react";

// export function ContactSection() {
//   return (
//     <section id="contact" className="relative py-24 lg:py-32 bg-white">
//       <div className="max-w-7xl mx-auto px-5 lg:px-20">
//         <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
//           {/* Left - Info */}
//           <motion.div
//             initial={{ opacity: 0, x: -30 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             viewport={{ once: true }}
//           >
//             <span className="section-label">CONTACT US</span>
//             <h2 className="section-heading mt-4">Have Questions?</h2>
//             <p className="mt-4 text-lg text-black/60">
//               We'd love to hear from you. Reach out and we'll respond as soon as
//               we can.
//             </p>

//             <div className="mt-10 space-y-6">
//               <div className="flex items-center gap-4">
//                 <div className="w-12 h-12 rounded-xl bg-black/5 flex items-center justify-center">
//                   <Mail className="w-5 h-5 text-black" />
//                 </div>
//                 <div>
//                   <p className="text-sm text-black/50">Email</p>
//                   <p className="text-black font-medium">hello@lifevault.app</p>
//                 </div>
//               </div>

//               <div className="flex items-center gap-4">
//                 <div className="w-12 h-12 rounded-xl bg-black/5 flex items-center justify-center">
//                   <svg className="w-5 h-5 text-black" viewBox="0 0 24 24" fill="currentColor">
//                     <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
//                   </svg>
//                 </div>
//                 <div>
//                   <p className="text-sm text-black/50">Twitter</p>
//                   <p className="text-black font-medium">@lifevault</p>
//                 </div>
//               </div>

//               <div className="flex items-center gap-4">
//                 <div className="w-12 h-12 rounded-xl bg-black/5 flex items-center justify-center">
//                   <MessageCircle className="w-5 h-5 text-black" />
//                 </div>
//                 <div>
//                   <p className="text-sm text-black/50">Discord</p>
//                   <p className="text-black font-medium">Join our community</p>
//                 </div>
//               </div>
//             </div>
//           </motion.div>

//           {/* Right - Form */}
//           <motion.div
//             initial={{ opacity: 0, x: 30 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             viewport={{ once: true }}
//           >
//             <div className="glass-card p-8 rounded-2xl bg-white border border-black/5 shadow-xl">
//               <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
//                 <div>
//                   <label className="block text-sm font-medium text-black/70 mb-2">
//                     Name
//                   </label>
//                   <input
//                     type="text"
//                     placeholder="Your name"
//                     className="input-glass"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-black/70 mb-2">
//                     Email
//                   </label>
//                   <input
//                     type="email"
//                     placeholder="you@example.com"
//                     className="input-glass"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-black/70 mb-2">
//                     Message
//                   </label>
//                   <textarea
//                     rows={4}
//                     placeholder="How can we help?"
//                     className="input-glass resize-none"
//                   />
//                 </div>

//                 <button className="btn-gradient w-full group flex items-center justify-center gap-2">
//                   Send Message
//                   <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
//                 </button>
//               </form>
//             </div>
//           </motion.div>
//         </div>
//       </div>
//     </section>
//   );
// }
