// app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <h1 className="text-white text-2xl font-bold tracking-tight">
                Spirit<span className="text-yellow-400">II</span>
              </h1>
            </div>
            <div className="flex gap-4">
              <Link
                href="/login"
                className="text-white hover:text-yellow-200 px-3 py-2 rounded-md text-sm font-medium"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="bg-yellow-400 text-blue-900 hover:bg-yellow-300 px-4 py-2 rounded-md text-sm font-medium shadow-sm"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-16 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="animate-float">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-24 h-24 rounded-full mx-auto shadow-xl transform rotate-45" />
          </div>
          <h1 className="mt-8 text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            Build Your Fantasy
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Cricket Empire
            </span>
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            Create your dream team, compete with rivals, and climb the
            leaderboard in the ultimate inter-university fantasy cricket
            experience!
          </p>
          <div className="mt-8 flex justify-center space-x-4">
            <Link
              href="/signup"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transform transition-all hover:scale-105 shadow-lg"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              📈
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Real-Time Stats
            </h3>
            <p className="text-gray-600">
              Track player performance with live updates and detailed analytics
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              🤖
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              AI Assistant
            </h3>
            <p className="text-gray-600">
              Get smart team suggestions from our Spiriter AI chatbot
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
              🏆
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Live Leaderboard
            </h3>
            <p className="text-gray-600">
              Compete with players worldwide and track your ranking
            </p>
          </div>
        </div>
      </div>

      {/* Test Account Banner */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 max-w-7xl mx-auto rounded-lg m-8">
        <div className="flex">
          <div className="flex-shrink-0">ℹ️</div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              Want to test first? Use demo account:
              <span className="font-mono bg-yellow-100 px-2 py-1 rounded ml-2">
                Username: spiritx_2025 | Password: SpiritX@2025
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-24 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} SpiritII. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
