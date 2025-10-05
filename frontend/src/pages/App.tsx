import { Outlet, Link } from 'react-router-dom'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-gradient-to-r from-primary-600 to-primary-400 text-white">
        <div className="max-w-5xl mx-auto p-4 flex justify-between items-center">
          <Link to="/" className="font-semibold text-xl">Harmonia</Link>
          <nav className="flex gap-4 text-sm opacity-90">
            <Link to="/">Upload</Link>
            <Link to="/intent">Intention</Link>
            <Link to="/customize">Personnaliser</Link>
            <Link to="/export">Exporter</Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 max-w-5xl mx-auto w-full p-4">
        <Outlet />
      </main>
      <footer className="border-t text-center text-xs py-3 opacity-75">© 2025 Harmonia</footer>
    </div>
  )
}
