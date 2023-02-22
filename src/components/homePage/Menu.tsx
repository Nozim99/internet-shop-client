import { useDispatch } from "react-redux"
import { setCategory } from "../../redux/slices/config"

export default function Menu() {
  const dispatch = useDispatch()

  return (
    <ul className='w-60 h-96 pl-5 max-sm:text-sm max-sm:w-32'>
      <li className="cursor-pointer border border-t-4 border-t-green-500 border-gray-400 text-xl font-semibold px-6 py-4 max-sm:text-sm max-sm:py-2 max-sm:px-2">Kategoriyalar</li>
      <li onClick={() => dispatch(setCategory("Motherboard"))} className="cursor-pointer border border-gray-400 hover:text-green-600 px-6 py-2 max-sm:px-2 max-sm:py-1">Ona plata</li>
      <li onClick={() => dispatch(setCategory("processor"))} className="cursor-pointer border border-gray-400 hover:text-green-600 px-6 py-2 max-sm:px-2 max-sm:py-1">Protsessor</li>
      <li onClick={() => dispatch(setCategory("Ram"))} className="cursor-pointer border border-gray-400 hover:text-green-600 px-6 py-2 max-sm:px-2 max-sm:py-1">RAM</li>
      <li onClick={() => dispatch(setCategory("Videocard"))} className="cursor-pointer border border-gray-400 hover:text-green-600 px-6 py-2 max-sm:px-2 max-sm:py-1">Videokarta</li>
      <li onClick={() => dispatch(setCategory("Memory"))} className="cursor-pointer border border-gray-400 hover:text-green-600 px-6 py-2 max-sm:px-2 max-sm:py-1">Xotira</li>
      <li onClick={() => dispatch(setCategory("Power"))} className="cursor-pointer border border-gray-400 hover:text-green-600 px-6 py-2 max-sm:px-2 max-sm:py-1">Blok pitaniya</li>
    </ul>
  )
}
