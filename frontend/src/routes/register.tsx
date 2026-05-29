import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import type { FormEvent } from 'react'

export const Route = createFileRoute('/register')({
  component: Register,
})

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Fungsi Register Terintegrasi API Backend
  const handleRegister = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    // Validasi
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Semua field wajib diisi!')
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Password minimal 6 karakter!')
      setIsLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Password dan konfirmasi password tidak sesuai!')
      setIsLoading(false)
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('Format email tidak valid!')
      setIsLoading(false)
      return
    }

    try {
      const res = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Gagal mendaftar')
        return
      }

      console.log('Response dari server:', data)

      // Simpan token ke localStorage
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))

      setSuccess('Registrasi berhasil! Mengalihkan ke dashboard...')
      setFormData({ name: '', email: '', password: '', confirmPassword: '' })
      
      // Redirect setelah 1.5 detik
      setTimeout(() => {
        window.location.href = '/about'
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
          
          {/* Header Register */}
          <div className="px-8 pt-10 pb-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-500 mb-6 shadow-lg shadow-indigo-200">
              <span className="text-white text-2xl font-bold font-mono">P</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Buat Akun Baru</h1>
            <p className="text-slate-500 mt-2 text-sm">Daftar untuk memulai pengalaman ProSystem</p>
          </div>

          {/* Form Register */}
          <form onSubmit={handleRegister} className="px-8 pb-10 space-y-4">
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

            {/* Nama Field */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">Nama Lengkap</label>
              <input
                type="text"
                name="name"
                required
                placeholder="Masukkan nama lengkap Anda"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">Email</label>
              <input
                type="email"
                name="email"
                required
                placeholder="nama@perusahaan.com"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 ml-1 block">Password</label>
              <input
                type="password"
                name="password"
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                value={formData.password}
                onChange={handleChange}
              />
              <p className="text-xs text-slate-400 mt-1 ml-1">Minimal 6 karakter</p>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 ml-1 block">Konfirmasi Password</label>
              <input
                type="password"
                name="confirmPassword"
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-center ml-1">
              <input
                id="terms"
                type="checkbox"
                required
                className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
              />
              <label htmlFor="terms" className="ml-2 text-xs font-medium text-slate-500">
                Saya setuju dengan <a href="#" className="text-indigo-600 hover:underline">Syarat & Ketentuan</a>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-cyan-500 text-white rounded-xl font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-indigo-200 focus:ring-4 focus:ring-indigo-500/30 disabled:opacity-70 flex items-center justify-center gap-2 mt-6"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Mendaftar...
                </>
              ) : 'Daftar Sekarang'}
            </button>

            {/* Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-400">Atau</span>
              </div>
            </div>

            {/* Social Register */}
            <button
              type="button"
              className="w-full py-2.5 px-4 bg-white border border-slate-200 text-slate-700 rounded-xl font-semibold text-xs hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" loading="lazy" className="w-4 h-4" alt="google logo" />
              Daftar dengan Google
            </button>
          </form>
        </div>

        {/* Footer Register */}
        <p className="text-center mt-8 text-sm text-slate-500">
          Sudah punya akun?{' '}
          <Link to="/" className="font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
            Masuk Sekarang
          </Link>
        </p>
      </div>
    </div>
  )
}
