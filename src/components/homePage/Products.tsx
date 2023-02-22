import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from "@fortawesome/free-regular-svg-icons"
import { faAngleDown, faCartShopping, faStar as solidStar } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { URLS } from '../../extra/URLS'
import Loader from '../extra/Loader'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'


interface Data {
  count: number,
  data: {
    _id: string,
    name: string,
    price: number,
    images: string[],
    category: string,
    like?: string[],
    desc?: string,
    character: {
      name: string,
      desc: string,
      _id: string
    }[],
    bought: number,
    amount: number,
    rate: number,
    createdAt: Date,
    comments: {
      commentBy: string,
      comment: string,
      rate: number,
      _id: string,
      createdAt: Date
    }[],
    __v: number
  }[]
}

export default function Products() {

  const navigate = useNavigate()
  const [data, setData] = useState<Data>()
  const [skip, setSkip] = useState(1)
  const { category } = useSelector((state: RootState) => state.config)

  const addProduct = () => {
    setSkip(skip + 1)
    if (category) {
      axios.get(URLS.start + URLS.getProductByCategory + `?category=${category}&limit=${20 * (skip + 1)}`)
        .then(result => {
          setData(result.data)
        })
        .catch(err => {
          console.error(err)
        })
    } else {
      axios.get(URLS.start + URLS.getProducts + `?limit=${20 * (skip + 1)}`)
        .then(result => {
          setData(result.data)
        })
        .catch(err => {
          console.error(err)
        })
    }
  }

  useEffect(() => {
    setSkip(1)
    setData(undefined)
    if (category) {
      axios.get(URLS.start + URLS.getProductByCategory + `?category=${category}&limit=100`)
        .then(result => {
          setData(result.data)
        })
        .catch(err => {
          console.error(err)
        })
    } else {
      axios.get(URLS.start + URLS.getProducts + `?limit=20`)
        .then(result => {
          setData(result.data)
          const newData: Data = result.data
          for (let i = 0; i < newData.data.length; i++) {
            let num = 0;
            for (let j = 0; j < newData.data[i].comments.length; j++) {
              num += newData.data[i].comments[j].rate
            }
            num = Number((num / newData.data[i].comments.length).toFixed(1))
            newData.data[i].rate = num || 0
          }
        })
        .catch(err => {
          console.error(err)
        })
    }
  }, [category])

  if (!data) {
    return <div className='relative w-full'>
      <Loader />
    </div>
  }

  return (
    <div className='w-full'>
      <div className="grid grid-cols-5 ml-5">
        {
          data.data.map((item, index) => (
            <div key={index} onClick={() => navigate("/product/byId/" + item._id)} className="w-48 mb-8 products mx-3 bg-white/70 pt-1.5 px-1.5 border-2 product_shadow max-lg:w-36 cursor-pointer max-sm:w-28 max-sm:h-52">
              <div className='h-32 img_loader overflow-hidden max-sm:h-24'>
                <img className="w-100 h-100 mx-auto bg-gray-200 object-cover" src={item.images[0]} alt="" />
              </div>
              <p className="mt-3 overflow-hidden whitespace-pre-line h-12 max-sm:text-sm max-sm:h-10">{item.name}</p>
              <div className='flex justify-between mt-1 pr-1 max-sm:text-sm'>
                <div className='flex items-center'>
                  <FontAwesomeIcon className='text-[#CC290A] text-sm mr-1.5 max-sm:mr-0.5 max-sm:text-xs' icon={solidStar} />
                  <span className='mr-3 max-sm:text-xs'>{item.rate || 0}</span>
                </div>
                <div className='max-sm:text-xs'><span>{item.bought}</span> sotildi</div>
              </div>
              <div className='mt-3 font-bold text-lg overflow-hidden whitespace-nowrap max-sm:mt-1 max-sm:text-xs'>{item.price.toLocaleString("ru-RU")} so'm</div>
            </div>
          ))
        }
      </div>
      {
        skip * 20 < data.count ? (
          <div className='flex justify-center mb-20'>
            <button onClick={addProduct} className='bg-orange-500 hover:bg-orange-600 text-white px-20 py-0.5 text-lg tracking-wide'><span>Yana</span> <FontAwesomeIcon className='text-sm' icon={faAngleDown} /></button>
          </div>
        ) : ""
      }
    </div>
  )
}
