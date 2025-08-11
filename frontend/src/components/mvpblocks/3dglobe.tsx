import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { heroContent } from "@/constants/landing";

export default function Globe3D() {
  return (
    <section
      className="relative w-full overflow-hidden pt-32 pb-10 font-light text-white antialiased md:pt-20 md:pb-16"
      style={{ backgroundImage: "var(--color-home-background)" }}>
      <div
        className="absolute top-0 right-0 h-1/2 w-1/2"
        style={{
          background:
            "radial-gradient(circle at 70% 30%, rgba(155, 135, 245, 0.15) 0%, rgba(13, 10, 25, 0) 60%)",
        }}
      />
      <div
        className="absolute top-0 left-0 h-1/2 w-1/2 -scale-x-100"
        style={{
          background:
            "radial-gradient(circle at 70% 30%, rgba(155, 135, 245, 0.15) 0%, rgba(13, 10, 25, 0) 60%)",
        }}
      />

      <div className="relative z-10 container mx-auto max-w-2xl px-4 text-center md:max-w-4xl md:px-6 lg:max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}>
          <span
            className="mb-6 mt-10 inline-block rounded-full border px-3 py-1 text-xs 
             border-[#7a68c3] text-[#7a68c3] 
             dark:border-[#9b87f5]/30 dark:text-[#9b87f5]">
            {heroContent.topSpan}
          </span>
          <h1 className="mx-auto mb-6 max-w-4xl text-4xl font-light md:text-5xl lg:text-7xl text-[#0d0505] dark:text-white">
            {heroContent.h1FirstPart}
            <span className="text-[#9b87f5]">{heroContent.h1Span}</span>
            {heroContent.h1LastPart}
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-800 dark:text-white/60 md:text-xl ">
            {heroContent.description}
          </p>

          <div className="mb-10 flex flex-col items-center justify-center gap-4 sm:mb-0 sm:flex-row">
            <Link
              to="/register"
              className="neumorphic-button relative w-full sm:w-auto overflow-hidden rounded-full border px-8 py-4 text-gray-700 dark:text-white shadow-lg transition-all duration-300
                        bg-gradient-to-b from-white/80 to-white/60 hover:border-gray-300 hover:shadow-md
                        dark:bg-gradient-to-b dark:from-white/10 dark:to-white/5 dark:border-white/10 dark:hover:border-[#9b87f5]/30 dark:hover:shadow-[0_0_20px_rgba(155,135,245,0.5)]">
              Get Started
            </Link>

            <a
              href="#how-it-works"
              className="flex w-full items-center justify-center gap-2 dark:text-white/70 text-gray-600 transition-colors dark:hover:text-white hover:text-black sm:w-auto">
              <span>Learn how it works</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round">
                <path d="m6 9 6 6 6-6"></path>
              </svg>
            </a>
          </div>
        </motion.div>
        <motion.div
          className="relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}>
          <div className="relative flex h-40 w-full overflow-hidden md:h-64">
            <img
              src="https://blocks.mvp-subha.me/assets/earth.png"
              alt="Earth"
              className="absolute top-0 left-1/2 -z-10 mx-auto -translate-x-1/2 px-4 opacity-80"
              width={800}
              height={800}
            />
          </div>
          <div className="relative z-10 mx-auto max-w-5xl rounded-2xl shadow-[0_0_50px_rgba(155,135,245,0.2)]">
            <div
              style={{
                backgroundImage: "var(--dashboard-src)",
              }}
              role="img"
              aria-label="Lunexa Dashboard"
              className="h-full w-full aspect-[20/10.5]  rounded-2xl border border-white/10 bg-cover bg-center"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
