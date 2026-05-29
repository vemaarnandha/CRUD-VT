import { createRootRoute, Link, Outlet, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) {
      setUser(JSON.parse(stored))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    navigate({ to: '/' })
  }

  return (
    <div className="w-screen h-screen flex flex-col bg-slate-50 font-sans text-slate-900 overflow-hidden">
      <header className="sticky top-0 z-50 w-screen backdrop-blur-md bg-white/70 border-b border-slate-200/60 shadow-sm">
        <div className="px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-cyan-500 shadow-md flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800">ProSystem</span>
          </div>

          <nav className="flex gap-8 items-center">
            <Link to="/" className="[&.active]:text-indigo-600 [&.active]:font-semibold text-slate-500 hover:text-indigo-500 transition-colors text-sm font-medium">
              Beranda
            </Link>
            <Link to="/about" className="[&.active]:text-indigo-600 [&.active]:font-semibold text-slate-500 hover:text-indigo-500 transition-colors text-sm font-medium">
              Tentang Kami
            </Link>
            <div className="h-5 w-px bg-slate-200"></div>

            {/* Kondisi: sudah login atau belum */}
            {user ? (
              <div className="flex items-center gap-3">
                {/* Avatar + Nama */}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center shadow-sm">
                    <span className="text-white font-bold text-xs">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-slate-700">{user.name}</span>
                </div>
                {/* Tombol Logout */}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg font-semibold text-xs hover:bg-red-50 hover:text-red-500 transition-all"
                >
                  Keluar
                </button>
              </div>
            ) : (
              <Link
                to="/register"
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-cyan-500 text-white rounded-lg font-semibold text-xs hover:opacity-90 transition-all shadow-sm"
              >
                Daftar
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-grow w-screen px-6 py-8 overflow-x-hidden">
        <Outlet />
      </main>

      <footer className="w-screen bg-white border-t border-slate-200 mt-auto">
        <div className="px-6 py-8 text-center text-sm text-slate-400">
          <p>&copy; {new Date().getFullYear()} ProSystem. Siap diintegrasikan dengan Backend.</p>
        </div>
      </footer>
    </div>
  )
}