const teamMembers = [
  'Ashutosh Garg',
  'Aman Agrawal',
  'Saanvi Gupta',
  'Yashvardhan Potphode',
  'Satwik Misra',
  'Sanjana Maida',
];

export default function TeamSection() {
  return (
    <section id="team" className="flex min-h-[50vh] items-center justify-center bg-white dark:bg-background-dark py-16 md:py-24 transition-colors duration-300">
      <div className="container mx-auto px-4 md:px-8 text-center">
        <h2 className="text-center font-display text-4xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-5xl mb-8">
          The Architects of Change
        </h2>

        <div className="mx-auto max-w-2xl">
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-lg md:text-xl font-medium text-gray-700 dark:text-gray-200">
            {teamMembers.map((member) => (
              <li key={member} className="py-2 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                {member}
              </li>
            ))}
          </ul>

          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-white/10">
            <p className="text-sm uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Mentored By</p>
            <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
              Prof. Shaheen Beh Mughal
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
