"use client"
import Image from 'next/image'
import React from 'react'
import Logo from "@/../public/new-logo.png"


const page = () => {
  return (
    <div className='bg-gray-900'>test
      <Image src={Logo} alt='logo' width={1000} height={1000}/>
    </div>
  )
}

export default page