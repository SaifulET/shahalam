
import RealEstateProject from '@/component/floorplaningPage/FloorPlaningPage'
import Navbar from '@/component/home/navbar'
import ThemeToggle from '@/component/ThemeToggle/ThemeToggle'
import React from 'react'

function page() {
  return (
    <div><Navbar/> <div className="absolute right-1 top-3 ">
                <ThemeToggle />
              </div><RealEstateProject/></div>
  )
}

export default page