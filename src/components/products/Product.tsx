import React, { ChangeEvent, useEffect, useState } from 'react'
import { faHeart, faStar, faStarHalfStroke, faUser } from '@fortawesome/free-regular-svg-icons'
import { faHeart as solidHeart, faCartPlus, faStar as solidStar, faCartShopping, faAngleLeft, faAngleRight, faChevronLeft, faChevronRight, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { URLS } from '../../extra/URLS'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import Loader from '../extra/Loader'
import { setSignUp } from '../../redux/slices/config'
import { Toast } from '../../extra/Toast'

export interface Data {
  _id: string,
  name: string,
  price: number,
  images: string[],
  rate: number,
  category: "Motherboard" | "processor" | "Ram" | "Videocard" | "Memory" | "Power",
  like: string[],
  createdBy: string,
  createdAt: Date,
  desc: string,
  character?: {
    name: string,
    desc: string
  }[],
  comments: {
    commentBy: {
      name: string,
      _id: string
    },
    comment: string,
    rate: number,
    createdAt: Date
  }[],
  bought: number,
  amount: number
}
interface UserInfo {
  cart: string[],
  like: string[]
}
export default function Product() {

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id } = useParams()
  const { token } = useSelector((state: RootState) => state.config)
  const [info, setInfo] = useState<"description" | "characteristics" | "comments">("description")
  const [data, setData] = useState<Data>()
  const [amount, setAmount] = useState(1)
  const [user, setUser] = useState<UserInfo>()
  const [heartLoad, setHeartLoad] = useState(false)
  const [cartLoad, setCartLoad] = useState(false)
  const [buyLoad, setBuyLoad] = useState(false)
  const [comment, setComment] = useState("")
  const [rateHover, setRateHover] = useState(0)
  const [rate, setRate] = useState(0)
  const [commentLoad, setCommentLoad] = useState(false)

  const addComment = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value)
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px"
  }
  const sendComment = () => {
    if (token) {
      if (rate) {
        setCommentLoad(true)
        axios.post(URLS.start + URLS.addComment, {
          rate,
          comment,
          productId: data?._id
        }, { headers: { Authorization: `Bearer ${token}` } })
          .then(result => {
            setCommentLoad(false)
            setFetch(result.data, setData)
            setComment("")
            setRate(0)
          })
          .catch(error => {
            setCommentLoad(false)
            Toast.error("Komment yaratilmadi")
            console.error(error)
          })
      } else {
        Toast.error("Mahsulotni bahosini kiriting")
      }
    } else {
      dispatch(setSignUp(true))
    }
  }
  const changeAmount = (amountItem: number) => {
    if (data?.amount) {
      if (data?.amount && amountItem > data.amount) {
        setAmount(data.amount)
      } else {
        setAmount(amountItem)
      }
    }
  }
  const likeProduct = () => {
    if (token) {
      setHeartLoad(true)
      axios.put(URLS.start + URLS.likeProduct, {
        id: data?._id
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then(result => {
        setHeartLoad(false)
        setUser(result.data)
      })
        .catch(error => {
          setHeartLoad(false)
          console.error(error)
        })
    } else {
      dispatch(setSignUp(true))
    }
  }
  const likeRemove = () => {
    setHeartLoad(true)
    axios.delete(URLS.start + URLS.removeLike + data?._id, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(result => {
      setHeartLoad(false)
      setUser(result.data)
    })
      .catch(error => {
        setHeartLoad(false)
        console.error(error)
      })
  }
  const addToCart = () => {
    if (token) {
      setCartLoad(true)
      axios.put(URLS.start + URLS.cartProduct, {
        id: data?._id
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(result => {
          setCartLoad(false)
          setUser(result.data)
        })
        .catch(error => {
          setCartLoad(false)
          console.error(error)
        })
    } else {
      dispatch(setSignUp(true))
    }
  }
  const removeFromCart = () => {
    setCartLoad(true)
    axios.delete(URLS.start + URLS.removeCart + data?._id, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(result => {
        setCartLoad(false)
        setUser(result.data)
      })
      .catch(error => {
        setCartLoad(false)
        console.error(error)
      })
  }
  const buyProduct = () => {
    if (data && amount >= 1 && amount <= data.amount) {
      setBuyLoad(true)
      axios.put(URLS.start + URLS.buyProduct, {
        id: data._id,
        amount: amount
      }, { headers: { Authorization: `Bearer ${token}` } })
        .then(result => { setFetch(result.data, setData); setBuyLoad(false); setAmount(1) })
        .catch(error => { console.error(error); setBuyLoad(false) })
    }
  }

  const setFetch = (n: Data, m: React.Dispatch<React.SetStateAction<Data | undefined>>) => {
    const newData = n
    let num = 0;
    if (newData.comments && newData.comments.length) {
      for (let i = 0; i < newData.comments.length; i++) {
        num += newData.comments[i].rate
      }
      num = Number((num / newData.comments.length).toFixed(1))
    }
    newData.rate = num
    m(newData)
  }

  useEffect(() => {
    if (id) {
      axios.get(URLS.start + URLS.getProductById + id)
        .then(result => {
          setFetch(result.data, setData)
        })
        .catch(err => {
          console.error(err)
          navigate("/page-not-found")
        })
    } else {
      console.log("navigate")
      navigate("/page-not-found")
    }

    if (token) {
      axios.get(URLS.start + URLS.getUserInfo, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(result => {
          setUser(result.data)
        })
        .catch(error => {
          console.error(error)
        })
    }
  }, [token])

  if (!data) {
    return <div style={{ minHeight: "calc(100vh - 13.6rem)" }}><Loader /></div>
  }

  return (
    <div className='container mx-auto min_height mb-20'>
      {/* Mahsulot nomi */}
      <h1 className='mt-5 text-2xl font-semibold mx-5'>{data?.name}</h1>
      <div className='mt-5 flex justify-between mx-5 max-sm:flex-col'>
        {/* Mahsulot rasmi */}
        <div className='w-72 h-72 relative border-2 border-gray-300 max-sm:mx-auto max-sm:w-80 max-sm:h-80'>
          <div className='absolute center_box object-cover product_img img_loader'>
            <img className='object-cover w-full h-full' src={data?.images[0]} />
          </div>
        </div>
        {/* Mahsulotni sotib olish bo'limi */}
        <div className='ml-20 border-2 border-gray-300 px-6 py-3 w-80 mr-96 max-xl:w-auto max-xl:mr-0 max-md:ml-0 max-sm:w-80 max-sm:mx-auto max-sm:mt-5'>
          <div className='text-3xl font-semibold'>{data?.price.toLocaleString("ru-RU")} so'm</div>
          <div className='flex items-center mt-5'>
            <input onChange={(e) => changeAmount(Number(e.target.value))} value={amount} className='outline-none border-2 border-gray-400 px-1 py-0.5 w-16 text-xl rounded font-bold' type="number" min={1} />
            {
              heartLoad ? <FontAwesomeIcon className='mx-5 text-3xl cursor-pointer load_heart' icon={solidHeart} /> :
                user ? (user.like.includes(data._id)
                  ? <FontAwesomeIcon onClick={likeRemove} className='mx-5 text-3xl cursor-pointer text-red-500' icon={solidHeart} />
                  : <FontAwesomeIcon onClick={likeProduct} className='mx-5 text-3xl cursor-pointer text-gray-800 hover:text-red-500' icon={faHeart} />) :
                  <FontAwesomeIcon onClick={likeProduct} className='mx-5 text-3xl cursor-pointer text-gray-800 hover:text-red-500' icon={faHeart} />
            }
          </div>
          <div className='mt-4 flex items-center'>
            {data.rate > 0 ? (data.rate < 0.5 ? <FontAwesomeIcon className='text-amber-500 text-xl mx-1' icon={faStarHalfStroke} /> : <FontAwesomeIcon className='text-amber-500 text-xl' icon={solidStar} />) : <FontAwesomeIcon className='text-gray-700 text-xl' icon={faStar} />}
            {data.rate > 1 ? (data.rate < 1.5 ? <FontAwesomeIcon className='text-amber-500 text-xl mx-1' icon={faStarHalfStroke} /> : <FontAwesomeIcon className='text-amber-500 text-xl' icon={solidStar} />) : <FontAwesomeIcon className='text-gray-700 text-xl' icon={faStar} />}
            {data.rate > 2 ? (data.rate < 2.5 ? <FontAwesomeIcon className='text-amber-500 text-xl mx-1' icon={faStarHalfStroke} /> : <FontAwesomeIcon className='text-amber-500 text-xl' icon={solidStar} />) : <FontAwesomeIcon className='text-gray-700 text-xl' icon={faStar} />}
            {data.rate > 3 ? (data.rate < 3.5 ? <FontAwesomeIcon className='text-amber-500 text-xl mx-1' icon={faStarHalfStroke} /> : <FontAwesomeIcon className='text-amber-500 text-xl' icon={solidStar} />) : <FontAwesomeIcon className='text-gray-700 text-xl' icon={faStar} />}
            {data.rate > 4 ? (data.rate < 4.5 ? <FontAwesomeIcon className='text-amber-500 text-xl mx-1' icon={faStarHalfStroke} /> : <FontAwesomeIcon className='text-amber-500 text-xl' icon={solidStar} />) : <FontAwesomeIcon className='text-gray-700 text-xl' icon={faStar} />}
            <div className='ml-1 flex items-center'><span className='text-lg font-medium'>{data.rate}</span></div>
          </div>
          <div className='flex mt-3'>
            <div className=' text-sm'>
              <span className='text-gray-500'>Sotildi:</span> <span>{data?.bought}</span>
            </div>
            <div className='mx-3 text-sm'>
              <span className='text-gray-500'><span className={data.amount <= 0 ? "text-red-500" : ""}>Mavjud:</span></span> <span>{data.amount}</span>
            </div>
            <div className=' text-sm'>
              <span className='text-gray-500'>comment:</span> <span>{data?.comments?.length}</span>
            </div>
          </div>
          <div className='mt-2 flex items-center'>
            <span className='text-gray-600 mr-1'>Jami summa: </span> <span className='font-semibold text-lg'>{data?.price ? (data.price * amount).toLocaleString("ru-RU") : ""} so'm</span>
          </div>
          <button onClick={buyProduct} className={'mt-6 text-white tracking-wider font-semibold w-full py-1 rounded hover:bg-green-500 ' + (buyLoad ? "pointer-events-none bg-green-700 " : "bg-green-600 ") + ((!data.amount || !token) ? "pointer-events-none" : "")}>Sotib olish {buyLoad ? <FontAwesomeIcon className='circle_animate' icon={faSpinner} /> : ""} </button>
        </div>
        <div className='w-80 max-lg:w-0 max-md:hidden'></div>
      </div>
      {/* Mahsulot haqida */}
      <div className='mt-10 flex border-b border-gray-400 mx-5'>
        <div style={{ top: "0.04rem" }} onClick={() => setInfo("description")} className={info === "description" ? 'border w-36 h-10 py-1.5 border-gray-400 border-b-0 bg-white relative rounded-t font-semibold tracking-wide text-lg cursor-default max-sm:text-sm' : "w-36 py-1.5 relative h-10 tracking-wide hover:bg-gray-200/60 cursor-pointer"}><span className={info === "description" ? 'absolute center_box' : 'absolute center_box underline'}>Tavsif</span></div>
        <div style={{ top: "0.04rem" }} onClick={() => setInfo("characteristics")} className={info === "characteristics" ? 'border w-36 h-10 py-1.5 border-gray-400 border-b-0 bg-white relative rounded-t font-semibold tracking-wide text-lg cursor-default max-sm:text-sm' : "w-36 py-1.5 relative h-10 tracking-wide hover:bg-gray-200/60 cursor-pointer"}><span className={info === "characteristics" ? 'absolute center_box' : 'absolute center_box underline'}>Xususiyatlari</span></div>
        <div style={{ top: "0.04rem" }} onClick={() => setInfo("comments")} className={info === "comments" ? 'border w-36 h-10 py-1.5 border-gray-400 border-b-0 bg-white relative rounded-t font-semibold tracking-wide text-lg cursor-default max-sm:text-sm' : "w-36 py-1.5 relative h-10 tracking-wide hover:bg-gray-200/60 cursor-pointer"}><span className={info === "comments" ? 'absolute center_box' : 'absolute center_box underline'}>Izohlar</span></div>
      </div>
      {
        // Description
        info === "description" ? (
          <div className='mt-3 px-5'>{data?.desc ? (
            data.desc.split("\n").map((item, index) => (
              <div key={index}>{item}</div>
            ))
          ) : <h3 className='text-3xl text-center text-gray-700 mt-6'>Tavsif mavjud emas</h3>}</div>
        ) : ""
      }
      {
        // Characteristics
        info === "characteristics" ? (
          data?.character ? data.character.length ? (
            <ul className='mx-5 mt-3 info_ul cursor-default border'>
              {data?.character?.map((item, index) => (
                <li key={index} className='px-3 py-1'><span className='w-3/6 inline-block font-semibold'>{item.name}</span> <span>{item.desc}</span></li>
              ))}
            </ul>
          ) : <h3 className='text-3xl text-center text-gray-700 mt-6'>Xususiyat ma'lumotlari mavjud emas</h3> : <h3 className='text-3xl text-center text-gray-700 mt-6'>Xususiyat ma'lumotlari mavjud emas</h3>
        ) : ""
      }
      {
        // Comments
        info === "comments" ? (
          <div>
            {/* Add comment */}
            <div className='mx-5 mt-8'>
              <div>
                <ul onMouseLeave={() => setRateHover(0)} className='flex text-xl mb-3 w-36'>
                  <li className='cursor-pointer'>{rate >= 1 ? <FontAwesomeIcon onClick={() => setRate(1)} onMouseEnter={() => setRateHover(1)} icon={solidStar} className='text-orange-500' /> : (rateHover >= 1 ? <FontAwesomeIcon onClick={() => setRate(1)} onMouseEnter={() => setRateHover(1)} icon={solidStar} className='text-orange-500' /> : <FontAwesomeIcon onMouseEnter={() => setRateHover(1)} icon={faStar} className='cursor-pointer text-gray-600' />)}</li>
                  <li className='mx-2 cursor-pointer'>{rate >= 2 ? <FontAwesomeIcon onClick={() => setRate(2)} onMouseEnter={() => setRateHover(2)} icon={solidStar} className='text-orange-500' /> : (rateHover >= 2 ? <FontAwesomeIcon onClick={() => setRate(2)} onMouseEnter={() => setRateHover(2)} icon={solidStar} className='text-orange-500' /> : <FontAwesomeIcon onMouseEnter={() => setRateHover(2)} className='text-gray-600' icon={faStar} />)}</li>
                  <li className='cursor-pointer'>{rate >= 3 ? <FontAwesomeIcon onClick={() => setRate(3)} onMouseEnter={() => setRateHover(3)} icon={solidStar} className='text-orange-500' /> : (rateHover >= 3 ? <FontAwesomeIcon onClick={() => setRate(3)} onMouseEnter={() => setRateHover(3)} icon={solidStar} className='text-orange-500' /> : <FontAwesomeIcon onMouseEnter={() => setRateHover(3)} icon={faStar} className='text-gray-600' />)}</li>
                  <li className='mx-2 cursor-pointer'>{rate >= 4 ? <FontAwesomeIcon onClick={() => setRate(4)} onMouseEnter={() => setRateHover(4)} icon={solidStar} className='text-orange-500' /> : (rateHover >= 4 ? <FontAwesomeIcon onClick={() => setRate(4)} onMouseEnter={() => setRateHover(4)} icon={solidStar} className='text-orange-500' /> : <FontAwesomeIcon onMouseEnter={() => setRateHover(4)} className='text-gray-600' icon={faStar} />)}</li>
                  <li className='cursor-pointer'>{rate >= 5 ? <FontAwesomeIcon onClick={() => setRate(5)} onMouseEnter={() => setRateHover(5)} icon={solidStar} className='text-orange-500' /> : (rateHover >= 5 ? <FontAwesomeIcon onClick={() => setRate(5)} onMouseEnter={() => setRateHover(5)} icon={solidStar} className='text-orange-500' /> : <FontAwesomeIcon onMouseEnter={() => setRateHover(5)} icon={faStar} className='text-gray-600' />)}</li>
                </ul>
              </div>
              <textarea style={{ minHeight: "5rem" }} value={comment} onChange={addComment} className='border border-gray-400 w-8/12 outline-none px-2 overflow-clip max-sm:w-full' placeholder='Izoh qoldiring'></textarea>
              <div>
                <button onClick={sendComment} className={'text-white px-16 py-1 mt-5 hover:bg-green-600 ' + (commentLoad ? "bg-green-700 pointer-events-none" : "bg-green-500")}>Komment qoldirish {commentLoad ? <FontAwesomeIcon className='circle_animate' icon={faSpinner} /> : ""}</button>
              </div>
            </div>
            {/* Comments */}
            {
              data.comments.length
                ? <div className='mt-10 mx-5'>
                  {data.comments.slice().reverse().map((item, index) => (
                    <div className='mb-5' key={index}>
                      <div className='flex items-center'><FontAwesomeIcon className='mr-2 text-sm' icon={faUser} /><span className='text-lg tracking-wider font-medium'>{item.commentBy.name}</span></div>
                      <div className='flex items-center'>
                        <ul className='flex text-lg mr-5'>
                          <li>{item.rate >= 1 ? <FontAwesomeIcon className='text-orange-600' icon={solidStar} /> : <FontAwesomeIcon className='text-gray-700' icon={faStar} />}</li>
                          <li className='mx-2'>{item.rate >= 2 ? <FontAwesomeIcon className='text-orange-600' icon={solidStar} /> : <FontAwesomeIcon className='text-gray-700' icon={faStar} />}</li>
                          <li>{item.rate >= 3 ? <FontAwesomeIcon className='text-orange-600' icon={solidStar} /> : <FontAwesomeIcon className='text-gray-700' icon={faStar} />}</li>
                          <li className='mx-2'>{item.rate >= 4 ? <FontAwesomeIcon className='text-orange-600' icon={solidStar} /> : <FontAwesomeIcon className='text-gray-700' icon={faStar} />}</li>
                          <li>{item.rate >= 5 ? <FontAwesomeIcon className='text-orange-600' icon={solidStar} /> : <FontAwesomeIcon className='text-gray-700' icon={faStar} />}</li>
                        </ul>
                        <div>{new Date(item.createdAt).toLocaleDateString("ru-RU")}</div>
                      </div>
                      {item.comment ? <div>{item.comment.split("\n").map((e, idx) => (
                        <div key={idx}>{e}</div>
                      ))}</div> : ""}
                    </div>
                  ))}
                </div>
                : <div className='text-3xl font-bolder text-gray-700 text-center mt-6'>
                  Bu mahsulotga izoh yozilmagan
                </div>
            }

          </div>
        ) : ""
      }

    </div>
  )
}
