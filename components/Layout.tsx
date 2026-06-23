import { ReactNode } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="pt-[72px]">{children}</main>
      <Footer />
    </>
  )
}
