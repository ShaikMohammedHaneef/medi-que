import logo from "../assets/logo/medique-logo.png";

export default function Navbar() {
  return (
    <nav className="border-b border-[#DAE0E7] bg-white dark:border-[#374151] dark:bg-[#1F2937]">
      <div className="mx-auto h-16 flex item-center max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8 ">
        <div className="flex items-center gap-8">
          <a href="/" className="felx items-center">
            <img src={logo} alt="MediQue" className="h-12 w-auto" />
          </a>
          <div className="hidden md:flex items-center gap-6 mt-1.5">
            <a
              href="/"
              className="text-sm text-[#1D2530] transition-colors hover:text-[#0B81B7] dark:text-[#F3F4F6] dark:hover:text-[#1598CF]"
            >
              Home
            </a>
            <a
              href="/"
              className="text-sm text-[#1D2530] transition-colors hover:text-[#0B81B7] dark:text-[#F3F4F6] dark:hover:text-[#1598CF]"
            >
              Track Queue
            </a>
            <a
              href="/"
              className="text-sm text-[#1D2530] transition-colors hover:text-[#0B81B7] dark:text-[#F3F4F6] dark:hover:text-[#1598CF]"
            >
              About
            </a>
          </div>
        </div>
        <div className="hidden items-center gap-3 md:flex">
          <button className="h-9 bg-[#0B81B7] rounded-lg  px-5 text-sm font-medium text-white transition-colors hover:bg-[#096F9D]">
            Register
          </button>
          <button className="h-9 bg-[#0B81B7] rounded-lg px-5 text-sm font-medium text-white transition-colors hover:bg-[#096f9D]">Sign in</button>
        </div>
      </div>
    </nav>
  );
}
