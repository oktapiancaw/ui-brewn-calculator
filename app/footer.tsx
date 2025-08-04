'use client'
import { Button } from "@/components/ui/button"


import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Footer() {
  const { setTheme } = useTheme()

  return (
    <footer className="mt-24 border-t border-gray-100 px-0 py-4 dark:border-gray-800">
      <div className="flex items-center justify-between">
        <a href="https://oxtcaw.com" target="_blank">
        <span>© 2025 Oktapian.</span>
        </a>

        <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
            <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
            <span className="sr-only">Toggle theme</span>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
            Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
            Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
            System
            </DropdownMenuItem>
        </DropdownMenuContent>
        </DropdownMenu>
        {/* <div className="text-xs text-gray-400">
          <ThemeSwitch />
        </div> */}
      </div>
    </footer>
  )
}
