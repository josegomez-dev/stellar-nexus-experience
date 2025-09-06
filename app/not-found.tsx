export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-brand-900 to-neutral-900 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-brand-400 mb-6">Page Not Found</h2>
        <p className="text-neutral-300 mb-8 max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <a
          href="/"
          className="px-6 py-3 bg-gradient-to-r from-brand-500 to-accent-500 text-white font-semibold rounded-lg hover:from-brand-400 hover:to-accent-400 transition-all duration-300 inline-block"
        >
          Return Home
        </a>
      </div>
    </div>
  );
}