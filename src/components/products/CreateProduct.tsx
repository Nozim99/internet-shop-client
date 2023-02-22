import { faImage, faImages } from '@fortawesome/free-regular-svg-icons'
import { faPlus, faXmark, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import React, { useState } from 'react'
import CurrencyInput from 'react-currency-input-field'
import { URLS } from '../../extra/URLS'
import { Toast } from '../../extra/Toast'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { useNavigate } from 'react-router-dom'

export default function CreateProduct() {
  const navigate = useNavigate()
  const { token } = useSelector((state: RootState) => state.config)
  const [load, setLoad] = useState(false)

  // error
  const [nameE, setNameE] = useState("")
  const [priceE, setPriceE] = useState("")
  const [categoryE, setCategoryE] = useState("")
  const [amountE, setAmountE] = useState("")
  const [imageE, setImageE] = useState("")

  // error class
  const [nameC, setNameC] = useState("border-black")
  const [priceC, setPriceC] = useState("border-black")
  const [categoryC, setCategoryC] = useState("border-black")
  const [amountC, setAmountC] = useState("border-black")
  const [imageC, setImageC] = useState("border-black")

  // send data to server
  const [name, setName] = useState('')
  const [price, setPrice] = useState(0)
  const [category, setCategory] = useState("")
  const [amount, setAmount] = useState(0)
  const [image, setImage] = useState<File>()
  const [desc, setDesc] = useState("")
  const [characters, setCharacters] = useState<{ name: string; desc: string }[]>([])

  const addCharater = () => {
    setCharacters([...characters, { name: "", desc: "" }])
  }
  const removeCharacter = (id: number) => {
    const newItem = characters.slice()
    newItem.splice(id, 1)
    setCharacters(newItem)
  }
  const changeCharacterName = (id: number, value: string) => {
    const newItem = characters.slice()
    newItem[id].name = value
    setCharacters(newItem)
  }
  const changeCharacterDesc = (id: number, value: string) => {
    const newItem = characters.slice()
    newItem[id].desc = value
    setCharacters(newItem)
  }

  const sendData = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!name || name.length < 5 || name.length > 200 || !price || price < 0 || !image || !category || !amount || amount < 0) {
      if (!name) {
        setNameE("Mahsulot nomini kiriting")
        setNameC("border-red-500")
      } else if (name.length < 5) {
        setNameE("Mahsulot nomida kamida 5 ta belgi bo'lishi zarur")
        setNameC("border-red-500")
      } else if (name.length > 200) {
        setNameE("Belgilar soni ko'pida 200 ta bo'lishi zarur")
        setNameC("border-red-500")
      }
      if (!price || price < 0) {
        if (!price) {
          setPriceE("Mahsulot narxini kiriting")
          setPriceC("border-red-500")
        } else {
          setPriceE("Mahsulot narxini to'g'ri kiriting")
          setPriceC("border-red-500")
        }
      }
      if (!image) {
        setImageE("Mahsulot rasmini yuklang")
        setImageC("border-red-500")
      }
      if (!category) {
        setCategoryE("Mahsulot kategoriyasini kiriting")
        setCategoryC("border-red-500")
      }
      if (!amount || amount < 0) {
        if (!amount) {
          setAmountE("Mahsulot sonini kiriting")
          setAmountC("border-red-500")
        } else {
          setAmountE("Mahsulot sonini to'g'ri kiriting")
          setAmountC("border-red-500")
        }
      }
    } else {
      setLoad(true)
      const data = new FormData()
      data.append("file", image)
      data.append("upload_preset", "mezegram")
      data.append("cloud_name", "dtrhqmm9b")
      axios.post("https://api.cloudinary.com/v1_1/dtrhqmm9b/image/upload", data)
        .then(result => {
          if (result.data.url) {
            axios.post(URLS.start + URLS.createProduct, {
              name,
              price,
              category,
              amount,
              image: result.data.url,
              desc,
              character: characters
            }, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            })
              .then(result => {
                navigate("/product/byId/" + result.data)
              })
              .catch(err => {
                setLoad(false)
                console.error(err)
              })
          } else {
            setLoad(false)
            Toast.error("Mahsulot yaratilmadi")
          }
        })
        .catch(error => {
          setLoad(false)
          Toast.error("Mahsulot yaratilmadi")
          console.error(error)
        })
    }
  }

  return (
    <div className='min_height container mx-auto'>
      <h1 className='text-2xl font-medium my-5'>Mahsulot yaratish</h1>
      <form onSubmit={sendData}>
        <label htmlFor="item-name">Mahsulot nomi</label>
        <div className='mb-5 relative w-80'>
          <input onChange={e => { setName(e.target.value); setNameC("border-black"); setNameE("") }} className={'border w-full outline-none px-2 py-0.5 ' + nameC} type="text" id='item-name' />
          <div className='text-red-500 absolute right-0 text-sm'>{nameE}</div>
        </div>
        <label htmlFor="item-price">Mahsulot narxi</label>
        <div className='flex items-center mb-5 w-80 relative'>
          <CurrencyInput
            onChange={e => { setPrice(Number(e.target.value.replace(/,/g, ""))); setPriceC("border-black"); setPriceE("") }}
            className={'border w-full outline-none px-2 py-0.5 ' + priceC}
            id="item-price"
            decimalsLimit={2}
          />
          <span style={{ padding: "0.1rem 0.5rem" }} className={'border text-gray-700 border-l-0 ' + priceC}>so'm</span>
          <div className='text-red-500 absolute right-0 top-7 text-sm'>{priceE}</div>
        </div>
        <label htmlFor="item-category" className='block'>Kategoriya nomi</label>
        <div className='relative mb-5 inline-block'>
          <select onChange={e => { setCategory(e.target.value); setCategoryC("border-black"); setCategoryE("") }} className={'border rounded py-1 px-5 outline-none ' + categoryC} id="item-category">
            <option value="">- Kategoriyani tanlang -</option>
            <option value="Motherboard">Ona plata</option>
            <option value="processor">Protsessor</option>
            <option value="Ram">RAM</option>
            <option value="Videocard">Videokarta</option>
            <option value="Memory">Xotira</option>
            <option value="Power">Blok pitaniya</option>
          </select>
          <div className='text-red-500 absolute right-0 text-sm'>{categoryE}</div>
        </div>
        <label className='block' htmlFor="item-amount">Mahsulot soni</label>
        <div className='flex items-center w-80 mb-5 relative'>
          <CurrencyInput onChange={e => { setAmount(Number(e.target.value.replace(",", ""))); setAmountC("border-black"); setAmountE("") }} id='item-amount' className={'border w-full outline-none px-2 py-0.5 ' + amountC} min={0} decimalsLimit={2} />
          <span style={{ padding: "0.1rem 0.5rem" }} className={'border text-gray-700 border-l-0 ' + amountC}>ta</span>
          <div className='text-red-500 absolute right-0 text-sm top-7'>{amountE}</div>
        </div>

        <label htmlFor="item-image" className='inline-block w-80 border border-gray-500 px-2 py-0.5 cursor-pointer mt-5'><span className='mr-2'>Mahsulot rasmi</span> <FontAwesomeIcon className='text-sm' icon={faImage} /></label>
        <div className='text-gray-600 text-sm mt-0.5'>{image ? image.name : ""}</div>
        <div className='mb-5'>
          <input onChange={e => setImage(e.target.files?.[0])} className='hidden' type="file" id='item-image' accept='image/*' />
        </div>

        <label htmlFor="item-desc">Mahsulot tavsifi</label>
        <div className='mb-5'>
          <textarea onChange={e => setDesc(e.target.value)} id="item-desc" className='border border-gray-500 w-4/6 h-40 outline-none px-3 py-1 '></textarea>
        </div>

        <label className={characters.length ? 'block mb-2' : 'block mb-5'} htmlFor="item-character">Mahsulot harakteristikasi</label>
        {
          characters.length ? characters.map((item, index) => (
            <div key={index} className='mb-5 flex justify-between'>
              <div className='grid w-5/12'>
                <label className='text-gray-600' htmlFor="">Nomi</label>
                <input value={characters[index].name} onChange={(e) => changeCharacterName(index, e.target.value)} className='border-black border w-full outline-none px-2 py-0.5' type="text" />
              </div>
              <div className='grid w-5/12'>
                <label className='text-gray-600' htmlFor="">Tavsif</label>
                <input value={characters[index].desc} onChange={e => changeCharacterDesc(index, e.target.value)} className='border-black border w-full outline-none px-2 py-0.5' type="text" />
              </div>
              <FontAwesomeIcon onClick={() => removeCharacter(index)} className='relative top-6 text-xl cursor-pointer' icon={faXmark} />
            </div>
          )) : ""
        }
        <button onClick={addCharater} type='button' className='bg-blue-500 text-white w-80 py-1 mb-5 hover:bg-blue-600 max-sm:w-60 max-sm:ml-1'><FontAwesomeIcon icon={faPlus} /> Harakteristika qo'shish</button>
        <button type='submit' className={'block mt-5 text-white w-full py-1 mb-16 hover:bg-green-500 max-sm:w-11/12 max-sm:mx-auto ' + (load ? "bg-green-700 pointer-events-none" : "bg-green-600")}>Mahsulot yaratish {load ? <FontAwesomeIcon className='circle_animate ml-1' icon={faSpinner} /> : ""} </button>
      </form>
    </div>
  )
}
