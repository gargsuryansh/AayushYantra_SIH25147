const solutions = [
  {
    icon: 'Pressure System',
    title: 'Precision in Control',
    copy:
      'A stabilized control loop maintains exact temperature and pressure levels, enabling consistent and predictable contouring outcomes.',
  },
  {
    icon: 'Quick Form',
    title: 'Faster, Smoother Forming',
    copy:
      'Soft inserts achieve optimal shaping within minutes, reducing clinic workload and accelerating patient rehabilitation.',
  },
  {
    icon: 'Live Monitor',
    title: 'Effortless Session Tracking',
    copy:
      'Live readings and structured records keep each fitting session documented, improving workflow clarity and long-term traceability.',
  },
];

export default function SolutionSection() {
  return (
    <section id="solution" className="flex min-h-screen items-center justify-center bg-white dark:bg-background-dark py-16 md:py-24 transition-colors duration-300">
      <div className="container mx-auto px-4 md:px-8">
        <h2 className="text-center font-display text-4xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-5xl">
          A New Dawn in Diagnostics
        </h2>
        <p className="mx-auto mt-4 mb-12 max-w-3xl text-center text-lg text-gray-600 dark:text-white/70">
          From the quiet resolve of our vision, a solution emerged - one that whispers of intelligence, speed, and
          boundless possibility.
        </p>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {solutions.map((solution) => (
            <article
              key={solution.title}
              className="flex flex-col gap-4 rounded-xl bg-gray-100 dark:bg-surface-dark p-6 transition-transform hover:-translate-y-1"
            >
              <span className="material-symbols-outlined text-4xl text-primary">{solution.icon}</span>
              <p className="text-xl font-medium text-gray-900 dark:text-white">{solution.title}</p>
              <p className="text-sm text-gray-600 dark:text-white/70">{solution.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
