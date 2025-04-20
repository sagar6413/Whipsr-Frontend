import Navbar from "@/components/layout/Navbar";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 mb-4">
          Welcome to MyApp
        </h1>
        <p className="max-w-2xl text-lg sm:text-xl text-gray-600 mb-8">
          The best place to manage your stuff. Securely and efficiently.
        </p>
        <div>
          {/* Call to action button - Links to signup or dashboard depending on auth state */}
          {/* We can access auth state here too if needed, but often simpler to just link to signup/login */}
          <Link
            href="/signup"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-4"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Log In
          </Link>
        </div>
      </main>
      <footer className="py-6 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} MyApp, Inc. All rights reserved.
      </footer>
    </div>
  );
}
