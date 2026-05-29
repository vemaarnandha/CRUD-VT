import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import type { FormEvent } from 'react'

export const Route = createFileRoute('/')({
  component: Login,
})

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Fungsi Login Terintegrasi API Backend
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      const res = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      const data = await res.json()

      // Pengecekan jika backend mengembalikan error (misal: password salah)
      if (!res.ok) {
        setError(data.message || 'Gagal login dari server')
        return
      }

      console.log('Response dari server:', data)

      // Simpan token ke localStorage
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))

      setSuccess('Login berhasil! Mengalihkan...')
      setEmail('')
      setPassword('')
      
      // Redirect setelah 1.5 detik
      setTimeout(() => {
        // Nantinya Anda bisa gunakan useNavigate dari TanStack untuk redirect
        // misal: navigate({ to: '/dashboard' })
        window.location.href = '/about' // Sementara redirect ke halaman about
      }, 1500)

    } catch (err) {
      console.error(err)
      setError('Koneksi ke server gagal. Pastikan backend sedang berjalan di http://localhost:3000')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[70vh] animate-in fade-in zoom-in duration-500">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
          
          {/* Header Login */}
          <div className="px-8 pt-10 pb-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-500 mb-6 shadow-lg shadow-indigo-200">
              <span className="text-white text-2xl font-bold font-mono">P</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Selamat Datang Kembali</h1>
            <p className="text-slate-500 mt-2 text-sm">Silahkan masuk ke akun ProSystem Anda</p>
          </div>

          {/* Form Login */}
          <form onSubmit={handleLogin} className="px-8 pb-10 space-y-5">
            {/* Error Alert */}
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Success Alert */}
            {success && (
              <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                <p className="text-green-700 text-sm font-medium">{success}</p>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">Email</label>
              <input
                type="email"
                required
                placeholder="nama@perusahaan.com"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <div className="flex justify-between mb-2 ml-1">
                <label className="text-sm font-semibold text-slate-700">Password</label>
                <a href="#" className="text-xs font-medium text-indigo-600 hover:text-indigo-700">Lupa Password?</a>
              </div>
              <input
                type="password"
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Remember Me Toggle */}
            <div className="flex items-center ml-1">
              <input
                id="remember"
                type="checkbox"
                className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
              />
              <label htmlFor="remember" className="ml-2 text-xs font-medium text-slate-500">Ingat perangkat ini</label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-cyan-500 text-white rounded-xl font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-indigo-200 focus:ring-4 focus:ring-indigo-500/30 disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Memverifikasi...
                </>
              ) : 'Masuk Sekarang'}
            </button>

            {/* Alternatif Login / Social */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-400">Atau lanjut dengan</span>
              </div>
            </div>

            <button
              type="button"
              className="w-full py-2.5 px-4 bg-white border border-slate-200 text-slate-700 rounded-xl font-semibold text-xs hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" loading="lazy" className="w-4 h-4" alt="google logo" />
              Google
            </button>
          </form>
        </div>

        {/* Footer Login */}
        <p className="text-center mt-8 text-sm text-slate-500">
          Belum punya akun?{' '}
          <Link to="/register" className="font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
            Daftar Gratis
          </Link>
        </p>
      </div>
    </div>
  )
}