const heroImage = '/product-showcase.jpg';

export default function Hero() {
  return (
    <section id="home" className="flex min-h-screen items-center justify-center bg-white dark:bg-background-dark py-16 md:py-24 transition-colors duration-300">
      <div className="container mx-auto flex flex-col gap-12 px-4 md:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
          <div className="flex flex-col gap-6 lg:w-1/2">
            <div className="flex flex-col gap-4 text-left">
              <h1 className="font-display text-5xl font-black leading-tight tracking-tight text-gray-900 dark:text-white lg:text-7xl">
                BioFit 3D. Comfort Re-engineered. Mobility Reborn.
              </h1>
              <p className="text-lg leading-normal text-gray-700 dark:text-white/80 lg:text-xl">
                Where precision contouring meets human-centered design — redefining how prosthetic sockets are shaped, fit,
                and experienced.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="flex h-12 min-w-[84px] items-center justify-center rounded-lg bg-primary px-5 text-base font-bold tracking-[0.015em] text-background-dark transition-colors hover:bg-primary/90">
                <span className="truncate">Experience the Story</span>
              </button>
              <button className="flex h-12 min-w-[84px] items-center justify-center rounded-lg bg-gray-200 dark:bg-surface-dark px-5 text-base font-bold tracking-[0.015em] text-gray-900 dark:text-white transition-colors hover:bg-gray-300 dark:hover:bg-white/10">
                <span className="truncate">Discover More</span>
              </button>
            </div>
          </div>
          <div className="w-full lg:w-1/2">
            <img
              src={heroImage}
              alt="High-quality render of the BioFit 3D device showing its sleek, modern design."
              className="w-full h-auto object-contain rounded-xl"
            />
          </div>
        </div>
      </div >
    </section >
  );
}
