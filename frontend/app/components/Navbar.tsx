"use client"

export default function Navbar() {
  return (
    <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
      <div className="container mx-auto px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-[#1e40af]">AnaDef.ai Analytics</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Powered by Covalent</span>
          </div>
        </div>
      </div>
    </nav>
  )
}

