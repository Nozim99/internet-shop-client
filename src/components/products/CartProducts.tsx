import React, { useEffect, useState } from 'react'
import Loader from '../extra/Loader'
import { URLS } from '../../extra/URLS'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { useNavigate } from 'react-router-dom'
import { Data } from './LikeProducts'
import { faStar } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function CartProducts() {
    const navigate = useNavigate()
    const { token } = useSelector((state: RootState) => state.config)
    const [data, setData] = useState<Data[]>()
    const [calc, setCalc] = useState()

    useEffect(() => {
        if (token) {
            axios.get(URLS.start + URLS.getLikedProducts, { headers: { Authorization: `Bearer ${token}` } })
                .then(result => { setData(result.data);  })
                .catch(error => console.error(error))
        } else {
            navigate("/")
        }
    }, [])

    if (!data) return <Loader />
    return (
        <div className='cart-products container mx-auto'>
            <h3 className='mt-10 text-3xl tracking-wider font-bold'>Savatdagi mahsulotlar</h3>

            <div className='mt-10'>
                {
                    data.map((item, index) => (
                        <div className='flex mb-5' key={index}>
                            <div className='w-32 h-32 overflow-hidden img_loader border m-0.5'><img className='w-full h-full object-cover bg-gray-200' src={item.images[0]} /></div>
                            <div className='ml-4'>
                                <div className='h-12 overflow-hidden w-4/6 whitespace-pre-wrap'><span className='cursor-pointer hover:underline' onClick={() => navigate(`/product/byId/${item._id}`)}>{item.name}</span></div>
                                <div className='tracking-wide font-medium text-xl'>{item.price.toLocaleString("ru-RU")} so'm</div>
                                <div className='flex items-center mt-3'>
                                    <input type="number" className='border border-gray-500 px-2 py-0.5 font-bold text-xl w-20' min={1} defaultValue={1} /><span className='border border-gray-500 border-l-0 py-0.5 text-xl px-1.5'>ta</span>
                                    <span className='ml-5'>jami:</span> <span className='ml-2 text-xl font-bold'>{item.price} so'm</span>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}
