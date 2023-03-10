import { faSpinner, faStar, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import { Data } from './Product'
import axios from 'axios'
import { URLS } from '../../extra/URLS'
import { RootState } from '../../redux/store'
import { useSelector } from 'react-redux'
import Loader from '../extra/Loader'
import { Toast } from '../../extra/Toast'
import { useNavigate } from 'react-router-dom'

export default function MyProducts() {
  const navigate = useNavigate()
  const { token } = useSelector((state: RootState) => state.config)
  const [data, setData] = useState<Data[]>()
  const [rate, setRate] = useState(0)
  const [deleteLoad, setDeleteLoad] = useState("")
  const [amount, setAmount] = useState(1)
  const [increaseLoad, setIncreaseLoad] = useState("")
  const [amountS, setAmountS] = useState<number[]>([])

  const setDataFunc = (serverData: Data[], setFunc: React.Dispatch<React.SetStateAction<Data[] | undefined>>) => {
    const newData = serverData.slice()

    for (let i = 0; i < newData.length; i++) {
      let num = 0
      const obj = newData[i]
      setAmountS(new Array(newData.length).fill(1))

      if (obj.comments.length) {
        for (let j = 0; j < obj.comments.length; j++) {
          num += obj.comments[j].rate
        }
      }
      obj.rate = Number((num / obj.comments.length).toFixed(1)) || 0
    }
    setFunc(newData)
  }
  const deleteGroup = (id: string) => {
    setDeleteLoad(id)
    axios.delete(URLS.start + URLS.deleteGroup + id, { headers: { Authorization: `Bearer ${token}` } })
      .then(result => {
        setDeleteLoad("")
        setDataFunc(result.data, setData)
      }).catch(error => {
        setDeleteLoad("")
        Toast.error("Guruh o'chirilmadi")
        console.error(error)
      })
  }
  const increaseAmount = (id: string, index: number) => {
    setIncreaseLoad(id)
    axios.post(URLS.start + URLS.increaseAmountOfProduct, { amount: amountS[index], groupId: id }, { headers: { Authorization: `Bearer ${token}` } })
      .then(result => { setDataFunc(result.data, setData); setIncreaseLoad("") })
      .catch(error => { console.error(error); setIncreaseLoad("") })
  }
  const changeAmount = (num: number, index: number) => {
    if (num >= 1) {
      const newAmount = [...amountS]
      newAmount[index] = num
      setAmountS(newAmount)
    }
  }

  useEffect(() => {
    axios.get(URLS.start + URLS.getMyProducts, { headers: { Authorization: `Bearer ${token}` } })
      .then(result => {
        setDataFunc(result.data, setData)
      })
  }, [])

  return (
    <div style={{ minHeight: "calc(100vh - 13.6rem)" }} className='container mx-auto'>
      <h3 className='text-3xl font-bold my-5 max-md:text-2xl'>Yaratilgan mahsulotlar</h3>
      {
        !data ? <Loader /> :
          <div>
            {
              data.length ?
                data.slice().reverse().map((item, index) => (
                  <div key={index} className='flex mb-10'>
                    <div className='w-32 h-32 img_loader'><img className='w-full h-full object-cover' src={item.images[0]} alt="" /></div>
                    <div className='ml-4 w-5/6'>
                      <div className='h-12 overflow-hidden'><span onClick={() => navigate("/product/byId/" + item._id)} className='hover:underline cursor-pointer'>{item.name}</span></div>
                      <div className='mt-2 flex items-center'>
                        <FontAwesomeIcon className='text-lg text-orange-600 mr-1' icon={faStar} />
                        <span className='font-medium mr-4'>{item.rate}</span>
                        <span className='mr-1 text-gray-600'>sotildi: </span> <span>{item.bought}</span>
                        <span className='ml-4 mr-1 text-gray-600'>mavjud: </span> <span>{item.amount}</span>
                        <span className='ml-4 mr-1 text-gray-600'>comment: </span> <span>{item.comments.length}</span>
                      </div>
                      <div className='flex justify-between mt-3 max-md:text-sm max-md:items-center'>
                        <div className='flex items-center'>
                          <span className='mr-2 max-md:mr-0 max-md:w-20'>Mahsulot qo'shish</span>
                          <input onChange={(e) => changeAmount(Number(e.target.value), index)} value={amountS[index]} min={1} type="number" className='w-20 outline-none px-2 text-lg border border-gray-400 font-bold' /> <span className='border border-gray-400 border-l-0 text-lg px-1.5'>ta</span>
                          <button onClick={() => increaseAmount(item._id, index)} className={'px-3 rounded py-0.5 text-white ml-8 hover:bg-green-600 max-md:px-1 ' + (increaseLoad === item._id ? "pointer-events-none bg-green-700" : "bg-green-500")}>Mahsulot qo'shish {increaseLoad === item._id ? <FontAwesomeIcon className='circle_animate' icon={faSpinner} /> : ""}</button>
                          <button onClick={() => deleteGroup(item._id)} className={'px-3 ml-5 rounded py-0.5 text-white hover:bg-red-600 max-md:px-1 hidden max-sm:inline-block ' + (deleteLoad === item._id ? "bg-red-700 pointer-events-none" : "bg-red-500")}><FontAwesomeIcon icon={faTrash} /> {deleteLoad === item._id ? <FontAwesomeIcon className='circle_animate' icon={faSpinner} /> : ""}</button>
                        </div>
                        <button onClick={() => deleteGroup(item._id)} className={'px-3 rounded py-0.5 text-white hover:bg-red-600 max-md:px-1 max-sm:hidden ' + (deleteLoad === item._id ? "bg-red-700 pointer-events-none" : "bg-red-500")}>Mahsulotni o'chirish {deleteLoad === item._id ? <FontAwesomeIcon className='circle_animate' icon={faSpinner} /> : ""}</button>
                      </div>
                    </div>
                  </div>
                ))
                : <h3 className='text-center text-3xl font-bold text-gray-700'>Mahsulot mavjud emas!</h3>
            }
          </div>
      }
    </div>
  )
}
