export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-background-dark px-4 py-8 text-center text-white/60">
      <p className="text-sm">
        © {new Date().getFullYear()} BioFit 3D. A Future Crafted, A Vision Shared.
      </p>
    </footer>
  );
}
