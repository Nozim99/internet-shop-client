import { useNavigate } from 'react-router-dom'
import Signin from '../auth/Signin'
import { useDispatch, useSelector } from "react-redux"
import { RootState } from '../../redux/store'
import Signup from '../auth/Signup'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faCartShopping, faHeart, faArrowRightFromBracket, faCube, faCubes } from '@fortawesome/free-solid-svg-icons'
import React, { useEffect, useRef, useState } from 'react'
import { ToastContainer } from 'react-toastify'
import { setSignIn, setSignUp, setCategory, logOut } from '../../redux/slices/config'

export default function Navbar() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { signIn, signUp, name } = useSelector((state: RootState) => state.config)
  const [modal, setModal] = useState(false)

  const ref = useRef<HTMLDivElement>(null)

  const logout = () => {
    dispatch(logOut());
    setModal(false)
    navigate("/")
  }

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setModal(false)
      }
    }

    if (modal) {
      document.addEventListener("mousedown", handler)
    } else {
      document.removeEventListener("mousedown", handler)
    }
  })

  return (
    <div className='border-b-2 border-gray-300'>
      <div className='flex justify-between container mx-auto py-3 px-3'>
        <h1 onClick={() => { navigate("/"); dispatch(setCategory(undefined)) }} className='text-2xl tracking-wider font-bold cursor-pointer'>MEZES</h1>
        <div>
          {name ? <div className='relative'>
            <button onClick={() => setModal(true)} className='flex items-center'><span className='tracking-wide font-medium mr-1'>{name}</span> <FontAwesomeIcon className={'text-sm transition-all ' + (modal ? "rotate-180" : "")} icon={faAngleDown} /></button>
            {
              modal ? <div ref={ref} className='absolute top-0 right-0'>
                <div onClick={() => setModal(false)} className='h-10 z-30 cursor-default'></div>
                <div className='w-56 border border-gray-400'>
                  {/* <button onClick={() => { navigate("/cart/products"); setModal(false) }} className='bg-white w-full text-start pl-5 hover:bg-gray-100 py-2'><FontAwesomeIcon className='text-sm text-gray-700 mr-2' icon={faCartShopping} /> Savatdagi mahsulotlar</button> */}
                  <button onClick={() => { navigate("/my/products"); setModal(false) }} className='bg-white w-full text-start pl-5 hover:bg-gray-100 py-2'><FontAwesomeIcon className='text-sm text-gray-700 mr-2' icon={faCubes} /> Mahsulotlarim</button>
                  <button onClick={() => { navigate("/like/products"); setModal(false) }} className='bg-white w-full text-start pl-5 hover:bg-gray-100 py-2'><FontAwesomeIcon className='text-sm text-gray-700 mr-2' icon={faHeart} /> Sevimli mahsulotlar</button>
                  <button onClick={() => { setModal(false); navigate("/product/create") }} className='bg-white w-full text-start pl-5 hover:bg-gray-100 py-2'><FontAwesomeIcon className='text-sm text-gray-700 mr-2' icon={faCube} /> Mahsulot yaratish</button>
                  <button onClick={logout} className='bg-white w-full text-start pl-5 hover:bg-gray-100 py-2'><FontAwesomeIcon className='text-sm text-gray-700 mr-2' icon={faArrowRightFromBracket} /> Chiqish</button>
                </div>
              </div> : ""
            }
          </div> : <>
            <button onClick={() => dispatch(setSignUp(true))} className='underline text-slate-500 hover:text-black font-semibold mr-5 max-sm:text-sm'>Ro'yhatdan o'tish</button>
            <button onClick={() => dispatch(setSignIn(true))} className='underline text-slate-500 hover:text-black font-semibold max-sm:text-sm'>Kirish</button>
          </>}
        </div>
      </div>
      {signIn ? <Signin /> : ""}
      {signUp ? <Signup /> : ""}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover
        theme="light"
      />
    </div>
  )
}
