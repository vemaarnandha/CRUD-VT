import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: About,
})

function About() {
  return (
    <div className="max-w-5xl mx-auto space-y-16 py-12 animate-in slide-in-from-bottom-4 fade-in duration-500">
      
      {/* Header About */}
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Tentang ProSystem</h1>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
          Arsitektur frontend modern untuk mendukung operasional bisnis Anda.
        </p>
      </div>

      {/* Content Section */}
      <div className="bg-white rounded-3xl  p-8 lg:p-12 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-12 items-center">
        
        {/* Mockup / Image Area */}
        <div className="w-full md:w-1/2 aspect-[4/3] bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl border border-slate-200/60 flex items-center justify-center shadow-inner overflow-hidden relative">
           <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px]"></div>
           <div className="relative bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col gap-2">
              <div className="w-32 h-4 bg-slate-200 rounded-full"></div>
              <div className="w-24 h-4 bg-slate-100 rounded-full"></div>
              <div className="w-40 h-24 bg-indigo-50 rounded-lg mt-2 border border-indigo-100"></div>
           </div>
        </div>

        {/* Text Info */}
        <div className="w-full md:w-1/2 space-y-6">
          <div className="inline-block px-3 py-1 bg-cyan-50 text-cyan-700 rounded-full text-xs font-bold uppercase tracking-wider">
            Visi & Misi
          </div>
          <h2 className="text-3xl font-bold text-slate-800">
            Fokus pada Pengalaman Pengguna
          </h2>
          <div className="space-y-4 text-slate-500 leading-relaxed">
            <p>
              Sebagai frontend developer, tugas utama di sini adalah memastikan semua interaksi pengguna berjalan lancar (smooth) sebelum tim backend menyuntikkan data dinamis dari database.
            </p>
            <p>
              Struktur ini dirancang agar moduler. Anda dapat dengan mudah menambahkan state management seperti Zustand atau Context API nantinya tanpa merusak tampilan.
            </p>
          </div>
          
          <div className="pt-4 border-t border-slate-100 mt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-200 rounded-full border-2 border-white shadow-sm"></div>
              <div>
                <p className="text-sm font-bold text-slate-800">Tim Frontend</p>
                <p className="text-xs text-slate-500">UI/UX & React Engineering</p>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  )
}