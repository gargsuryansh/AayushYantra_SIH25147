const features = [
  {
    icon: 'Pressure Accuracy',
    title: 'Unwavering Precision',
    description:
      'Precisely regulated pneumatic force ensures smooth, uniform contouring across the entire socket surface.',
  },
  {
    icon: 'Thermal Flow',
    title: 'Swift Thermal Response',
    description:
      'Rapid, controlled heating softens the insert evenly, enabling predictable and efficient forming cycles.',
  },
  {
    icon: 'Stable Output',
    title: 'Consistent Performance',
    description:
      'Stable temperature and pressure behavior minimize variations between sessions, improving the reliability of every fit.',
  },
  {
    icon: 'Safety Guard',
    title: 'Built-in Protection',
    description:
      'Integrated safety limits, thermal cutoffs, and pressure relief continuously safeguard both patient and technician.',
  },
  {
    icon: 'Session Metrics',
    title: 'Clear Session Metrics',
    description:
      'Structured measurements and trend logs help clinicians evaluate each contouring session with clarity.',
  },
  {
    icon: 'Portable Design',
    title: 'Portable Design',
    description:
      'A compact, lightweight design ensures smooth deployment across clinics, rehabilitation centers, and field camps.',
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-surface-dark py-16 md:py-24 transition-colors duration-300">
      <div className="container mx-auto px-4 md:px-8">
        <h2 className="text-center font-display text-4xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-5xl">
          Whispers of Precision
        </h2>
        <p className="mx-auto mt-4 mb-12 max-w-3xl text-center text-lg text-gray-600 dark:text-white/70">
          Every facet of our creation is designed to deliver not just data, but a profound understanding, down to the
          most minute detail.
        </p>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="flex flex-col items-center gap-4 rounded-xl bg-white dark:bg-background-dark p-6 text-center transition-transform hover:-translate-y-1 shadow-sm dark:shadow-none"
            >
              <span className="material-symbols-outlined text-4xl text-accent-lavender">{feature.icon}</span>
              <p className="font-body text-lg font-semibold text-gray-900 dark:text-white">{feature.title}</p>
              <p className="text-sm text-gray-600 dark:text-white/70">{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
