import { useDispatch } from "react-redux"
import { setCategory } from "../../redux/slices/config"

export default function Menu() {
  const dispatch = useDispatch()

  return (
    <ul className='w-60 h-96 pl-5'>
      <li className="cursor-pointer border border-t-4 border-t-green-500 border-gray-400 text-xl font-semibold px-6 py-4">Kategoriyalar</li>
      <li onClick={() => dispatch(setCategory("Motherboard"))} className="cursor-pointer border border-gray-400 hover:text-green-600 px-6 py-2">Ona plata</li>
      <li onClick={() => dispatch(setCategory("processor"))} className="cursor-pointer border border-gray-400 hover:text-green-600 px-6 py-2">Protsessor</li>
      <li onClick={() => dispatch(setCategory("Ram"))} className="cursor-pointer border border-gray-400 hover:text-green-600 px-6 py-2">RAM</li>
      <li onClick={() => dispatch(setCategory("Videocard"))} className="cursor-pointer border border-gray-400 hover:text-green-600 px-6 py-2">Videokarta</li>
      <li onClick={() => dispatch(setCategory("Memory"))} className="cursor-pointer border border-gray-400 hover:text-green-600 px-6 py-2">Xotira</li>
      <li onClick={() => dispatch(setCategory("Power"))} className="cursor-pointer border border-gray-400 hover:text-green-600 px-6 py-2">Blok pitaniya</li>
    </ul>
  )
}
