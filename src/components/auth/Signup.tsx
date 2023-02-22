import { faUser, faXmark, faLock, faCircleExclamation, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch } from "react-redux";
import React, { useRef, useState } from "react"
import axios from "axios";
import { setSignUp, setSignIn, setToken } from "../../redux/slices/config";
import { URLS } from "../../extra/URLS";

export default function Signup() {
  const dispatch = useDispatch()

  const [load, setLoad] = useState(false)

  // Class for errors   == border-red-500
  const [nameC, setNameC] = useState("border-inherit")
  const [passwordC, setPasswordC] = useState("border-inherit")
  const [confirmPasswordC, setConfirmPasswordC] = useState("border-inherit")

  // Sending data to the server
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // input error
  const [nameE, setNameE] = useState("")
  const [passwordE, setPasswordE] = useState("")
  const [confirmPasswordE, setConfirmPasswordE] = useState("")

  const ref = React.createRef<HTMLInputElement>()
  const confirmRef = React.createRef<HTMLInputElement>()

  const loginAcc = () => {
    dispatch(setSignUp(false))
    dispatch(setSignIn(true))
  }

  // SIGNUP
  const signup = () => {
    if (!name || name.length < 3) {
      setNameC("border-red-500")
      if (name) {
        setNameE("Belgilar 3 tadan ko'p bo'lishi zarur")
      } else {
        setNameE("Ismingizni kiriting")
      }
    } else if (!password || password.length < 3) {
      setPasswordC("border-red-500")
      if (password) {
        setPasswordE("Belgilar soni 3 tadan ko'p bolishi zarur")
      } else {
        setPasswordE("Parol kiriting")
      }
    } else if (confirmPassword !== password) {
      setConfirmPasswordC("border-red-500")
      setConfirmPasswordE("Parollar bir xil emas")
    } else {
      setLoad(true)
      axios.post(URLS.start + URLS.signup, {
        name,
        password
      })
        .then((result) => {
          const { token, name }: { token: string, name: string } = result.data
          dispatch(setToken([token, name]))
          dispatch(setSignUp(false))
        })
        .catch(error => {
          setLoad(false)
          if (error?.response?.data?.error === "This username already exists") {
            setNameE(error.response.data.error)
          }
          console.error(error)
        })
    }
  }

  return (
    <>
      <div onClick={() => dispatch(setSignUp(false))} className="fixed w-full h-full backdrop_blur bg-black/10 top-0 z-10"></div>
      <div className="bg-[#64748b] text-center flex flex-col window_center_fixed pt-6 pb-8 px-20 rounded z-20">
        <h1 className="text-2xl text-white font-bold tracking-wide mb-5">Hisob Yaratish</h1>
        <FontAwesomeIcon onClick={() => dispatch(setSignUp(false))} className="absolute top-2 right-3 text-color text-gray-100 cursor-pointer text-xl" icon={faXmark} />

        <div className="relative">
          <input onKeyDown={(e) => { if (e.key === "Enter" && ref.current) { ref.current.focus() } }} onChange={(e) => { setName(String(e.target.value)); setNameC("border-inherit"); setNameE("") }} required className={"border outline-none auth_input text-black py-1 px-4 rounded w-80 " + nameC} type="text" id="name" />
          <div className="login_input_name absolute font-semibold text-stone-600 pointer-events-none"><FontAwesomeIcon className="" icon={faUser} /> Username</div>
          {nameE ? <div className="text-gray-100 absolute text-sm right-0 flex items-center mt-0.5">{nameE} <FontAwesomeIcon className="text-red-500 bg-white rounded-full ml-1" icon={faCircleExclamation} /></div> : ""}
        </div>

        <div className="relative my-11">
          <input onKeyDown={e => { if (e.key === "Enter" && confirmRef.current) confirmRef.current.focus() }} ref={ref} onChange={e => { setPassword(String(e.target.value)); setPasswordC("border-inherit"); setPasswordE("") }} required className={"border auth_input outline-none text-black py-1 px-4 rounded w-80  " + passwordC} type="password" id="password" />
          <div className="login_input_name absolute font-semibold text-stone-600 pointer-events-none"><FontAwesomeIcon className="" icon={faLock} /> Password</div>
          {passwordE ? <div className="text-gray-100 absolute text-sm right-0 flex items-center mt-0.5">{passwordE} <FontAwesomeIcon className="text-red-500 bg-white rounded-full ml-1" icon={faCircleExclamation} /></div> : ""}
        </div>

        <div className="relative mb-8">
          <input onKeyDown={e => { if (e.key === "Enter") signup() }} ref={confirmRef} onChange={e => { setConfirmPassword(String(e.target.value)); setConfirmPasswordC("border-inherit"); setConfirmPasswordE("") }} required className={"border auth_input outline-none text-black py-1 px-4 rounded w-80 " + confirmPasswordC} type="password" id="confirm-password" />
          <div className="login_input_name absolute font-semibold text-stone-600 pointer-events-none"><FontAwesomeIcon className="" icon={faLock} /> Confirm password</div>
          {confirmPasswordE ? <div className="text-gray-100 absolute text-sm right-0 flex items-center mt-0.5">{confirmPasswordE} <FontAwesomeIcon className="text-red-500 bg-white rounded-full ml-1" icon={faCircleExclamation} /></div> : ""}
        </div>

        <button onClick={signup} className={"w-full hover:bg-green-500 p-1 rounded text-white font-medium tracking-wide " + (load ? "bg-green-700 pointer-events-none" : "bg-[#16A34A]")}>Yaratish {load ? <FontAwesomeIcon className="circle_animate" icon={faSpinner} /> : ""}</button>

        <div className="text-slate-200 text-sm text-end mt-1">
          Menda hisob mavjud! <span onClick={loginAcc} className="underline text-white cursor-pointer hover:text-green-100">Hisobga kirish</span>
        </div>
      </div>
    </>
  )
}