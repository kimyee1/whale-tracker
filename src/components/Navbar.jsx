// components/Navbar.jsx
// The top bar of your app — shows the logo and a "LIVE" badge

export default function Navbar() {
  return (
    <nav className="border-b border-gray-800 bg-gray-950 px-4 py-4">
      <div className="max-w-5xl mx-auto flex items-center justify-between">

        {/* Left side: Logo + app name */}
        <div className="flex items-center gap-3">
          {/* Blue circle with whale emoji — acts as the logo */}
          <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-lg">
            ??
          </div>
          <div>
            <div className="font-bold text-white text-base leading-tight">
              Base Whale Tracker
            </div>
            <div className="text-gray-500 text-xs">
              Base Mainnet • Live Data
            </div>
          </div>
        </div>

        {/* Right side: LIVE badge with a blinking dot */}
        <div className="flex items-center gap-2 bg-green-900/40 text-green-400 text-xs px-3 py-1.5 rounded-full border border-green-800">
          {/* This dot blinks using CSS animation "animate-pulse" */}
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          LIVE
        </div>

      </div>
    </nav>
  )
}
