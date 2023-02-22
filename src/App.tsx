import './App.css'
import HomePage from './components/homePage/HomePage'
import Navbar from './components/main/Navbar'
import { Routes, Route } from "react-router-dom"
import CreateProduct from './components/products/CreateProduct'
import Product from './components/products/Product'
import Footer from './components/main/Footer'
import { useEffect } from 'react'
import LikeProducts from './components/products/LikeProducts'
import CartProducts from './components/products/CartProducts'
import 'react-toastify/dist/ReactToastify.css';
import MyProducts from './components/products/MyProducts'
import PageNotFound from './components/extra/PageNotFound'

function App() {

  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/product/byId/:id' element={<Product />} />
        <Route path='/product/create' element={<CreateProduct />} />
        <Route path='/like/products' element={<LikeProducts />} />
        <Route path='/cart/products' element={<CartProducts />} />
        <Route path='/my/products' element={<MyProducts />} />
        <Route path='*' element={<PageNotFound />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
