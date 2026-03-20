import Link from "next/link";
import { Button } from "@packages/spark-ui";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4 py-20 text-center">
      <div 
        className="flex flex-col md:flex-row items-center justify-center max-w-6xl w-full mx-auto md:space-x-12 space-y-8 md:space-y-0 text-center md:text-left"
        aria-labelledby="not-found-title"
        aria-describedby="not-found-description"
      >
        <h1 className="inline-block text-8xl md:text-9xl lg:text-[10rem] font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-red-500 to-yellow-500" aria-hidden={true}>
          404
        </h1>

        <div className="hidden md:block w-px h-32 bg-gray-200 dark:bg-gray-800"></div>

        <div className="space-y-4">
          <h2 id="not-found-title" className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Oops! Page Not Found
          </h2>
          <p id="not-found-description" className="text-base sm:text-lg text-gray-600 dark:text-gray-400 w-full px-2 md:px-0">
            We couldn&apos;t find the page you&apos;re looking for. It might have been moved, deleted, or never existed.
          </p>
          <div className="pt-4">
            <Button asChild variant="colored" subVariant="blue" size="lg">
              <Link 
                href="/" 
                className="focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900 rounded-md transition-shadow"
                aria-label="Return to the homepage"
              >
                Return Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Decorative background elements matching GDG colors subtly */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden={true}>
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[100px]" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] rounded-full bg-yellow-500/5 blur-[100px]" />
        <div className="absolute -bottom-[10%] left-[20%] w-[50%] h-[50%] rounded-full bg-red-500/5 blur-[100px]" />
      </div>
    </div>
  );
}
