// components/Footer.jsx
// The bottom bar of your app

export default function Footer() {
  return (
    <footer className="border-t border-gray-800 mt-16 py-6 text-center text-gray-600 text-sm">
      <p>
        Built on{" "}
        <a
          href="https://base.org"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          Base
        </a>{" "}
        • Data via{" "}
        <a
          href="https://alchemy.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          Alchemy
        </a>
      </p>
      <p className="mt-1 text-xs text-gray-700">
        Auto-refreshes every 30 seconds
      </p>
    </footer>
  )
}
