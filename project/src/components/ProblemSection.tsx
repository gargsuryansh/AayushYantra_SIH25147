const problems = [
  {
    icon: 'timer_off',
    title: 'The Weight of Time',
    copy:
      'Manual socket adjustments often take hours, demanding repeated visits and long calibration cycles — delaying mobility for those who need it most.',
  },
  {
    icon: 'rule',
    title: 'The Shadow of Imprecision',
    copy:
      'Traditional heat-forming and hand-based shaping introduce variability, leaving users with pressure points, discomfort, and inconsistent fit.',
  },
  {
    icon: 'hourglass_empty',
    title: 'The Unseen Barriers',
    copy:
      'Bulky tools, skilled dependency, and limited access in rural settings keep personalized prosthetic care out of reach for many.',
  },
];

export default function ProblemSection() {
  return (
    <section id="problem" className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-surface-dark py-16 md:py-24 transition-colors duration-300">
      <div className="container mx-auto px-4 md:px-8">
        <h2 className="text-center font-display text-4xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-5xl">
          The Echoes of Yesterday
        </h2>
        <p className="mx-auto mt-4 mb-12 max-w-3xl text-center text-lg text-gray-600 dark:text-white/70">
          For decades, prosthetic fitting has battled time, discomfort, and imprecision — leaving millions without the
          comfort they deserve. BioFit 3D rises from these challenges.
        </p>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {problems.map((problem) => (
            <article
              key={problem.title}
              className="flex flex-col gap-4 rounded-xl bg-white dark:bg-background-dark p-6 transition-transform hover:-translate-y-1 shadow-sm dark:shadow-none"
            >
              <h3 className="font-display text-2xl font-bold text-accent-lavender">{problem.title}</h3>
              <p className="text-sm text-gray-600 dark:text-white/70">{problem.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
