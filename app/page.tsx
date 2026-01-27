import FoldersComponent from '@/component/home/forderSection'
import HeroSection from '@/component/home/hero'
import Navbar from '@/component/home/navbar'
import RecentProjectsComponent from '@/component/home/recentProjects/mainpage'
import ThemeToggle from '@/component/ThemeToggle/ThemeToggle'
import React from 'react'

function page() {
  return (
    <div ><div className="absolute right-0 m-[10px]  ">
                <ThemeToggle />
              </div><Navbar/><HeroSection/><RecentProjectsComponent/></div>
  )
}

export default page