import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { URLS } from '../../extra/URLS'
import Loader from '../extra/Loader'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'

interface Data {
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
    rate?: {
        rateBy: string,
        point: number
    }[],
    createdAt: Date,
    comments?: {
        commentBy: string,
        comment: string
    }[],
    __v: number
}

export default function LikeProducts() {
    const navigate = useNavigate()
    const { token } = useSelector((state: RootState) => state.config)
    const [data, setData] = useState<Data[]>()

    useEffect(() => {
        if (token) {
            axios.get(URLS.start + URLS.getLikedProducts, { headers: { Authorization: `Bearer ${token}` } })
                .then(result => { setData(result.data); console.log(result.data) })
                .catch(error => console.error(error))
        } else {
            navigate("/")
        }
    }, [])

    if (!data) return <Loader />

    return (
        <div className='like-products container mx-auto'>
            <h3 className='mt-10 text-3xl tracking-wider font-bold'>Sevimli mahsulotlar</h3>

            <div className='mt-10'>
                {
                    data.map((item, index) => (
                        <div onClick={() => navigate(`/product/byId/${item._id}`)} className='flex mb-5 cursor-pointer overflow-hidden' key={index}>
                            <div className='w-32 h-32 overflow-hidden img_loader border m-0.5'><img className='w-full h-full object-cover bg-gray-200' src={item.images[0]} /></div>
                            <div className='ml-4'>
                                <div className='h-12 overflow-hidden w-4/6 whitespace-pre-wrap'>{item.name}</div>
                                <div className='my-2'>
                                    <FontAwesomeIcon className='text-orange-600 mr-1' icon={faStar} />
                                    <span>4.7</span>
                                    <span className='ml-4'>7841</span> sotildi
                                </div>
                                <div className='tracking-wide font-medium text-xl'>{item.price.toLocaleString("ru-RU")} so'm</div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}
