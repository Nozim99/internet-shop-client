import React from 'react'

export default function Footer() {
  return (
    <div className='h-40 bg-gray-800 flex pt-5 max-sm:text-sm'>
      <ul className='ml-5 mr-20 max-sm:ml-1 max-sm:mr-5'>
        <li className='cursor-pointer text-gray-400 hover:text-white hover:underline'>Mobil ilovalar</li>
        <li className='cursor-pointer text-gray-400 hover:text-white hover:underline'>Yordam</li>
        <li className='cursor-pointer text-gray-400 hover:text-white hover:underline'>Pullik xizmatlar</li>
        <li className='cursor-pointer text-gray-400 hover:text-white hover:underline'>Saytda reklama</li>
      </ul>
      <ul>
        <li className='cursor-pointer text-gray-400 hover:text-white hover:underline'>Qanday sotib olish va sotish</li>
        <li className='cursor-pointer text-gray-400 hover:text-white hover:underline'>Xavjsizlik qoidalari</li>
        <li className='cursor-pointer text-gray-400 hover:text-white hover:underline'>Sayt xaritasi</li>
        <li className='cursor-pointer text-gray-400 hover:text-white hover:underline'>Mintaqalar xaritasi</li>
      </ul>
    </div>
  )
}
