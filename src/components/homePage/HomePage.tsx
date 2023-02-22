import React from 'react'
import Menu from './Menu'
import Products from "./Products"

export default function HomePage() {
  return (
    <div className='container mx-auto mt-8 min_height'>
      <div className='flex'>
        <Menu />
        <Products />
      </div>
    </div>
  )
}
