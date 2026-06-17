import Link from "next/link"
import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  showTagline?: boolean
}

export function Logo({ className, showTagline = true }: LogoProps) {
  return (
    <Link href="/" className={cn("flex items-center gap-3 group shrink-0", className)}>
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-primary/60 rounded-xl blur-sm opacity-70 group-hover:opacity-100 transition-opacity" />
        <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-primary/90 flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform overflow-hidden">
          <img src="/medaccess-logo.png" alt="MedAccess Logo" className="w-full h-full object-cover" />
        </div>
      </div>
      <div className="flex flex-col">
        <span className="font-bold text-xl text-gray-900 leading-none">
          MedAccess
        </span>
        {showTagline && (
          <span className="text-sm text-gray-600 -mt-0.5">
            Healthcare Accessible to All
          </span>
        )}
      </div>
    </Link>
  )
}
