export default function Footer() {
  return (
    <footer className="bg-[#1c1d1f] text-white py-12 pb-24 md:pb-12 px-6 border-t border-gray-700">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
        <div className="flex flex-col gap-4">
          <span className="text-2xl font-black font-serif tracking-tighter">Kodemy</span>
          <p className="text-sm text-gray-400 max-w-xs">Connecting students to the best instructors around the world.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-12 text-sm">
          <div className="flex flex-col gap-2">
          </div>
          <div className="flex flex-col gap-2">
            <span className="hover:underline cursor-pointer">About us</span>
            <span className="hover:underline cursor-pointer">Contact us</span>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-800 text-xs text-gray-400 flex justify-between items-center">
        <span>© 2026 Kodemy, Inc.</span>
      </div>
    </footer>
  );
}
