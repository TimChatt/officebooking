import { ReactNode } from "react";
import { Home, Calendar, BarChart2 } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Dashboard", icon: <Home size={18} />, href: "/" },
  { name: "Book a Desk", icon: <Calendar size={18} />, href: "/book" },
  { name: "Forecast", icon: <BarChart2 size={18} />, href: "/forecast" },
];

export default function Layout({ children }) { 
  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-4 hidden md:flex flex-col">
        <div className="text-xl font-bold mb-6">Office Booking</div>
        <nav className="flex flex-col space-y-2">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 p-2 rounded-md text-sm text-slate-700 hover:bg-slate-100 transition"
            >
              {item.icon}
              {item.name}
            </a>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-4">
          <span className="text-sm text-slate-500">Welcome back!</span>
          <div className="h-8 w-8 rounded-full bg-slate-300" />
        </header>

        {/* Page Content */}
        <main className="p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
