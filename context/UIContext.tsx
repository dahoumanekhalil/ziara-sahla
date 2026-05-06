'use client'
import { createContext, useContext, useState, ReactNode } from 'react'

interface UIContextType {
  isModalOpen: boolean
  isSidebarOpen: boolean
  openModal: () => void
  closeModal: () => void
  openSidebar: () => void
  closeSidebar: () => void
  toggleSidebar: () => void
}

const UIContext = createContext<UIContextType | null>(null)

export function UIProvider({ children }: { children: ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const openModal = () => {
    setIsModalOpen(true)
    document.body.style.overflow = 'hidden'
  }
  const closeModal = () => {
    setIsModalOpen(false)
    document.body.style.overflow = ''
  }
  const openSidebar = () => {
    setIsSidebarOpen(true)
    document.body.style.overflow = 'hidden'
  }
  const closeSidebar = () => {
    setIsSidebarOpen(false)
    document.body.style.overflow = ''
  }
  const toggleSidebar = () => {
    isSidebarOpen ? closeSidebar() : openSidebar()
  }

  return (
    <UIContext.Provider value={{ isModalOpen, isSidebarOpen, openModal, closeModal, openSidebar, closeSidebar, toggleSidebar }}>
      {children}
    </UIContext.Provider>
  )
}

export function useUI() {
  const ctx = useContext(UIContext)
  if (!ctx) throw new Error('useUI must be used within UIProvider')
  return ctx
}
