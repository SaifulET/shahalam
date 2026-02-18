
import Navbar from '@/component/home/navbar'
import ThemeToggle from '@/component/ThemeToggle/ThemeToggle'
import React from 'react'

function page() {
  return (
    <div><Navbar></Navbar><div className="absolute right-1 top-3  ">
            <ThemeToggle />
          </div></div>
  )
}

export default page