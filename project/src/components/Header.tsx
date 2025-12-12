import Image from 'next/image';
import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-gray-200 dark:border-white/10 bg-white/80 dark:bg-background-dark/80 px-4 py-3 backdrop-blur-md md:px-8 transition-colors duration-300">
      <Link href="/" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
        <Image src="/logo.png" alt="BioFit 3D Logo" width={48} height={48} className="object-contain" />
        <h2 className="font-display text-lg font-bold leading-tight tracking-tight text-gray-900 dark:text-white">
          BioFit 3D
        </h2>
      </Link>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <Link href="/dashboard">
          <button className="flex h-10 min-w-[84px] items-center justify-center rounded-lg bg-primary px-4 text-sm font-bold tracking-[0.015em] text-background-dark transition-colors hover:bg-primary/90">
            <span className="truncate">Start Live Session</span>
          </button>
        </Link>
      </div>
    </header>
  );
}