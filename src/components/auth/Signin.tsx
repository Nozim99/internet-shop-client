import { faUser, faXmark, faLock, faCircleExclamation, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch } from "react-redux";
import React, { useState } from "react"
import axios from "axios";
import { setSignIn, setSignUp, setToken } from "../../redux/slices/config";
import { URLS } from "../../extra/URLS";

export default function Signin() {
  const dispatch = useDispatch()

  const ref = React.createRef<HTMLInputElement>()
  const [load, setLoad] = useState(false)

  // Class for errors   == border-red-500
  const [nameC, setNameC] = useState("border-inherit")
  const [passwordC, setPasswordC] = useState("border-inherit")

  // Sending data to the server
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")

  // input error
  const [nameE, setNameE] = useState("")
  const [passwordE, setPasswordE] = useState("")

  // go to the signup page
  const createAccount = () => {
    dispatch(setSignIn(false))
    dispatch(setSignUp(true))
  }

  // Signin
  const signin = () => {
    if (!name || name.length < 3 || !password || password.length < 3) {
      if (!name || name.length < 3) {
        setNameC("border-red-500")
        if (name) {
          setNameE("Ism xato kiritildi")
        } else {
          setNameE("Ismingizni kiriting")
        }
      }
      if (!password || password.length < 3) {
        setPasswordC("border-red-500")
        if (password) {
          setPasswordE("Parol xato")
        } else {
          setPasswordE("Parolni kiriting")
        }
      }
    } else {
      setLoad(true)
      axios.post(URLS.start + URLS.signin, {
        name,
        password
      })
        .then(result => {
          const { token, name }: { token: string; name: string } = result.data
          dispatch(setToken([token, name]))
          dispatch(setSignIn(false))
        })
        .catch(err => {
          setLoad(false)
          if (err?.response?.data?.password) {
            setPasswordC("border-red-500")
            setPasswordE(err.response.data.error)
          } else if (err?.response?.data?.name) {
            setNameC("border-red-500")
            setNameE(err.response.data.error)
          }
          console.error(err)
        })
    }
  }

  return (
    <>
      <div
        onClick={() => dispatch(setSignIn(false))}
        className="fixed w-full h-full backdrop_blur bg-black/10 top-0 z-10"></div>
      <div className="bg-[#64748b] text-center flex flex-col window_center_fixed pt-4 pb-8 px-10 rounded z-20">
        <h1 className="text-2xl font-bold tracking-wide mb-5 text-white">Hisobga Kirish</h1>
        <FontAwesomeIcon
          onClick={() => dispatch(setSignIn(false))}
          className="absolute top-1 right-2 text-color text-gray-100 text-xl cursor-pointer" icon={faXmark} />

        <div className="relative mb-8">
          <input onKeyDown={e => { if (e.key === "Enter" && ref.current) ref.current.focus() }} onChange={(e) => { setName(String(e.target.value)); setNameC("border-inherit"); setNameE("") }} required className={"border auth_input outline-none text-black py-1 px-4 rounded w-80 " + nameC} type="text" id="name" />
          <div className="login_input_name absolute font-semibold text-stone-600 pointer-events-none"><FontAwesomeIcon className="" icon={faUser} /> Username</div>
          {nameE ? <div className="text-gray-100 absolute text-sm right-0 flex items-center mt-0.5">{nameE} <FontAwesomeIcon className="text-red-500 bg-white rounded-full ml-1" icon={faCircleExclamation} /></div> : ""}
        </div>

        <div className="relative mb-8">
          <input
            onKeyDown={e => { if (e.key === "Enter") signin() }} ref={ref} onChange={e => { setPassword(String(e.target.value)); setPasswordC("border-inherit"); setPasswordE("") }}
            required className={"border auth_input outline-none text-black py-1 px-4 rounded w-80  " + passwordC} type="password" id="password" />
          <div className="login_input_name absolute font-semibold text-stone-600 pointer-events-none"><FontAwesomeIcon className="" icon={faLock} /> Password</div>
          {passwordE ? <div className="text-gray-100 absolute text-sm right-0 flex items-center mt-0.5">{passwordE} <FontAwesomeIcon className="text-red-500 bg-white rounded-full ml-1" icon={faCircleExclamation} /></div> : ""}
        </div>

        <button
          onClick={signin}
          className={"w-full p-1 rounded text-white font-semibold tracking-wide relative " + (load ? "pointer-events-none bg-green-700" : "bg-[#16A34A] hover:bg-green-500")}>Kirish
          {load ? <FontAwesomeIcon className="circle_animate ml-1" icon={faSpinner} /> : ""}
        </button>
        <div className="text-slate-200 text-sm text-end mt-1">
          Menda hisob mavjud emas! <span
            onClick={createAccount}
            className="underline text-white cursor-pointer hover:text-green-100">Hisob yaratish</span>
        </div>
      </div>
    </>
  )
}