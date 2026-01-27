import PropertyUnitForm from '@/component/addUnitComponent/addUnitComponent'
import Navbar from '@/component/home/navbar'
import ThemeToggle from '@/component/ThemeToggle/ThemeToggle'
import React from 'react'

function page() {
  return (
    <div><Navbar></Navbar><div className="absolute right-0 m-[10px]  ">
        <ThemeToggle />
      </div><PropertyUnitForm></PropertyUnitForm></div>
  )
}

export default page