import FoldersComponent from '@/component/home/forderSection'
import HeroSection from '@/component/home/hero'
import Navbar from '@/component/home/navbar'
import RecentProjectsComponent from '@/component/home/recentProjects/mainpage'
import React from 'react'

function page() {
  return (
    <div><Navbar/><HeroSection/><RecentProjectsComponent/></div>
  )
}

export default page
