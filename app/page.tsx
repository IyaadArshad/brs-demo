'use client'

import Link from 'next/link'
import { Button } from './components/button'
import { 
  MenuIcon, 
  GitHubIcon, 
  SearchIcon, 
  PlusIcon, 
  HelpIcon, 
  SettingsIcon,
  ArrowLeftIcon,
  AIIcon,
  GlossaryIcon
} from './components/icons'
import '../styles/globals.css';

export default function GitHubMarkdownEditor() {
  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] font-[-apple-system,BlinkMacSystemFont,Segoe_UI,Helvetica,Arial,sans-serif]">
      {/* Top Navigation */}
      <header className="border-b border-[#30363d] bg-[#010409]">
        <div className="flex items-center px-4 h-[64px]">
          <Button variant="ghost" size="icon" className="mr-4">
            <MenuIcon />
          </Button>
          <GitHubIcon />
          <div className="flex items-center ml-4 text-sm">
            <Link href="#" className="text-[#c9d1d9] hover:text-[#2f81f7]">lyaadArshad</Link>
            <span className="mx-1">/</span>
            <Link href="#" className="text-[#c9d1d9] hover:text-[#2f81f7]">brsDemo</Link>
          </div>
          
          <div className="flex items-center ml-auto space-x-4">
            <div className="relative">
              <input 
                type="text"
                placeholder="Type ⌘ to search"
                className="w-72 h-9 bg-[#0d1117] border border-[#30363d] rounded-md pl-9 pr-3 text-sm placeholder:text-[#7d8590] focus:outline-none focus:ring-1 focus:ring-[#2f81f7]"
              />
            </div>
            <Button variant="ghost" size="icon">
              <PlusIcon />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <HelpIcon />
            </Button>
          </div>
        </div>

        {/* Secondary Navigation */}
        <nav className="flex items-center px-4 h-[48px] space-x-4 text-sm">
          <Link 
            href="#" 
            className="px-2 py-1 text-white border-b-2 border-[#f78166] hover:text-[#c9d1d9] rounded-md hover:bg-[#21262d] flex items-center gap-2"
          >
            <ArrowLeftIcon />
            Assisted
          </Link>
          <Link 
            href="#" 
            className="px-2 py-1 text-[#f6f6e7] hover:text-[#c9d1d9] border-b-2 border-transparent rounded-md hover:bg-[#21262d] flex items-center gap-2"
          >
            <AIIcon />
            AI Editor
          </Link>
          <Link 
            href="#" 
            className="px-2 py-1 text-[#f6f6e7] hover:text-[#c9d1d9] border-b-2 border-transparent rounded-md hover:bg-[#21262d] flex items-center gap-2"
          >
            <GlossaryIcon />
            Glossary
          </Link>
          <Link 
            href="#" 
            className="px-2 py-1 text-[#f6f6e7] hover:text-[#c9d1d9] border-b-2 border-transparent rounded-md hover:bg-[#21262d] flex items-center gap-2"
          >
            <SettingsIcon />
            Settings
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex">
            <button className="px-3 py-1 text-sm bg-[#21262d] text-[#c9d1d9] border border-[#30363d] rounded-l-md hover:bg-[#30363d]">
              Raw
            </button>
            <button className="px-3 py-1 text-sm bg-transparent text-[#c9d1d9] border border-l-0 border-[#30363d] rounded-r-md hover:bg-[#30363d]">
              Editor
            </button>
          </div>
          <button className="px-3 py-1 text-sm bg-[#21262d] text-[#c9d1d9] border border-[#30363d] rounded-md hover:bg-[#30363d]">
            Export RRS As Markdown
          </button>
        </div>

        {/* Markdown Content */}
        <div className="bg-[#0d1117] rounded-lg border border-[#30363d] p-8">
          <h1 className="text-4xl font-semibold mb-8 text-white">Salut.</h1>
          <p className="text-[#8b949e] mb-8">this github profile</p>

          <h2 className="text-2xl font-semibold mb-4 text-white border-b border-[#21262d] pb-2">About Me</h2>
          <ul className="space-y-3 mb-8">
            <li className="flex items-start gap-2">
              <span>🪁</span>
              <span>I&apos;m interested in flying kites</span>
            </li>
            <li className="flex items-start gap-2">
              <span>📚</span>
              <span>I&apos;m currently learning IGCSE Computer Science, Biology, Economics, Accounting, and Business, along with Edexcel Math and Cambridge English</span>
            </li>
            <li className="flex items-start gap-2">
              <span>💝</span>
              <span>I&apos;m looking to collaborate on flying a kite</span>
            </li>
            <li className="flex items-start gap-2">
              <span>📫</span>
              <span>How to reach me: <Link href="mailto:hello@acrofold.com" className="text-[#2f81f7] hover:underline">hello@acrofold.com</Link></span>
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mb-4 text-white border-b border-[#21262d] pb-2">Introduction</h2>
          <p className="mb-8">Iyaad is... Iyaad</p>

          <h2 className="text-2xl font-semibold mb-4 text-white border-b border-[#21262d] pb-2">What I&apos;m Up To (sort of)</h2>
          <ul className="list-disc pl-5 space-y-2 mb-8 marker:text-[#8b949e]">
            <li>bike</li>
            <li>school</li>
            <li>sleep</li>
            <li>eat</li>
          </ul>

          <p className="text-[#8b949e]">looking to do some good in this world while im here...</p>
        </div>
      </main>
    </div>
  )
}