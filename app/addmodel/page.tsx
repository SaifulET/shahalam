import AddModel from '@/component/addModel/addModel'
import Navbar from '@/component/home/navbar'
import ThemeToggle from '@/component/ThemeToggle/ThemeToggle'
import React from 'react'

function page() {
  return (
    <div><Navbar></Navbar><div className="absolute right-0 m-[10px]  ">
            <ThemeToggle />
          </div><AddModel></AddModel></div>
  )
}

export default page