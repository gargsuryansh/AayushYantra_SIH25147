export default function ContactSection() {
  return (
    <section id="contact" className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-surface-dark py-16 md:py-24 transition-colors duration-300">
      <div className="container mx-auto px-4 md:px-8">
        <div className="rounded-xl bg-white dark:bg-background-dark p-8 md:p-12 shadow-md dark:shadow-none">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:items-center">
            <div className="flex flex-col gap-4">
              <h2 className="font-display text-4xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white">Embark with Us</h2>
              <p className="text-lg text-gray-600 dark:text-white/70">
                Your voice is a vital thread in this tapestry of progress. Reach out, share your vision, or simply
                connect. Let&apos;s shape the future together.
              </p>
            </div>
            <form className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Your Name"
                className="h-12 rounded-lg border border-gray-300 dark:border-white/20 bg-gray-50 dark:bg-surface-dark px-4 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40 focus:border-primary focus:ring-primary"
              />
              <input
                type="email"
                placeholder="Your Email"
                className="h-12 rounded-lg border border-gray-300 dark:border-white/20 bg-gray-50 dark:bg-surface-dark px-4 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40 focus:border-primary focus:ring-primary"
              />
              <textarea
                rows={6}
                placeholder="Your Story / Inquiry"
                className="rounded-lg border border-gray-300 dark:border-white/20 bg-gray-50 dark:bg-surface-dark px-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40 focus:border-primary focus:ring-primary"
              />
              <button
                type="button"
                className="flex h-12 min-w-[84px] items-center justify-center rounded-lg bg-primary px-5 text-base font-bold tracking-[0.015em] text-background-dark transition-colors hover:bg-primary/90"
              >
                <span className="truncate">Send Your Message</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
