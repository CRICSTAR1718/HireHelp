import { createContext, useContext, useEffect } from 'react'
import type { ReactNode } from 'react'

interface ThemeContextType {
  theme: 'light'
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Force light theme
    document.documentElement.classList.remove('dark')
    document.documentElement.classList.add('light')
    localStorage.removeItem('theme')
  }, [])

  return (
    <ThemeContext.Provider value={{ theme: 'light' }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
