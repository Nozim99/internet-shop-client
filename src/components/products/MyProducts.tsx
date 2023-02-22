import { faSpinner, faStar } from '@fortawesome/free-solid-svg-icons'
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
  const [deleteLoad, setDeleteLoad] = useState(false)
  const [amount, setAmount] = useState(1)
  const [increaseLoad, setIncreaseLoad] = useState(false)

  const deleteGroup = (id: string) => {
    setDeleteLoad(true)
    axios.delete(URLS.start + URLS.deleteGroup + id, { headers: { Authorization: `Bearer ${token}` } })
      .then(result => {
        setDeleteLoad(false)
        setData(result.data)
      }).catch(error => {
        setDeleteLoad(false)
        Toast.error("Guruh o'chirilmadi")
        console.error(error)
      })
  }
  const increaseAmount = (id: string) => {
    setIncreaseLoad(true)
    axios.post(URLS.start + URLS.increaseAmountOfProduct, { amount, groupId: id }, { headers: { Authorization: `Bearer ${token}` } })
      .then(result => { setData(result.data); setIncreaseLoad(false) })
      .catch(error => { console.error(error); setIncreaseLoad(false) })
  }

  useEffect(() => {
    axios.get(URLS.start + URLS.getMyProducts, { headers: { Authorization: `Bearer ${token}` } })
      .then(result => {
        const newData: Data[] = result.data.slice()

        for (let i = 0; i < newData.length; i++) {
          let num = 0
          const obj = newData[i]
          if (obj.comments.length) {
            for (let j = 0; j < obj.comments.length; j++) {
              num += obj.comments[j].rate
            }
          }
          obj.rate = Number((num / obj.comments.length).toFixed(1)) || 0
        }

        setData(newData)
      })
  }, [])

  if (!data) return <Loader />
  return (
    <div style={{ minHeight: "calc(100vh - 13.6rem)" }} className='container mx-auto'>
      <h3 className='text-3xl font-bold my-5'>Yaratilgan mahsulotlar</h3>
      <div>
        {
          data.length ?
            data.map((item, index) => (
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
                  <div className='flex justify-between mt-3'>
                    <div className='flex items-center'>
                      <span className='mr-2'>Mahsulot qo'shish</span>
                      <input onChange={(e) => setAmount(Number(e.target.value))} value={amount} min={1} type="number" className='w-20 outline-none px-2 text-lg border border-gray-400 font-bold' /> <span className='border border-gray-400 border-l-0 text-lg px-1.5'>ta</span>
                      <button onClick={() => increaseAmount(item._id)} className={'px-3 rounded py-0.5 text-white ml-8 hover:bg-green-600 ' + (increaseLoad ? "pointer-events-none bg-green-700" : "bg-green-500")}>Mahsulot qo'shish {increaseLoad ? <FontAwesomeIcon className='circle_animate' icon={faSpinner} /> : ""}</button>
                    </div>
                    <button onClick={() => deleteGroup(item._id)} className={'px-3 rounded py-0.5 text-white hover:bg-red-600 ' + (deleteLoad ? "bg-red-700 pointer-events-none" : "bg-red-500")}>Mahsulotni o'chirish {deleteLoad ? <FontAwesomeIcon className='circle_animate' icon={faSpinner} /> : ""}</button>
                  </div>
                </div>
              </div>
            ))
            : <h3 className='text-center text-3xl font-bold text-gray-700'>Mahsulot mavjud emas!</h3>
        }
      </div>
    </div>
  )
}
