import React from 'react';
import ReactDOM from 'react-dom/client';

import Home from './Home';
import Header from './components/header/header';
import Footer from './components/footer/footer';
import Category from './components/categorys/category';
import Banner from './components/banners/banner';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AllProducts from './pages/productlists/productlist';
import Register from './pages/Register/Register';
import Singin from './pages/Login/Login';
import ProductDetail from './pages/Detai_product.js/DetaiProduct';
import { AuthProvider } from './context/AuthContext';
import { Navigate } from 'react-router-dom';
import "antd/dist/reset.css";
// import AdminRoute from './components/AdminMenu';
import AdminLayout from './admin/AdminLayout';
import Dashboard from './admin/page/Dashboard';
import Products from './admin/page/Product/Products';
import Users from './admin/page/Users/User';
import Images from './admin/page/Image/image';
import Categories from './admin/page/Category/Categories';
import Orders from './admin/page/order/order';
import Checkout from './components/checkout/checkout';
import { CartProvider } from "./context/CartContext";
import ListNews from './components/news/listnews';
import UserProfile from './pages/user/user';
// import AdminDashboard from './pages/admin/Dashboard';
// import AdminLayout from './admin/AdminLayout';
// import AdminLayout from './components/AdminLayout';
// import AdminDashboard from './pages/AdminDashboard';
// const isAdmin = () => { 
//   const userStr = localStorage.getItem("user"); 
//   if (!userStr) return false; 
//   try { 
//     const user = JSON.parse(userStr); 
//     return Number(user.role) === 0 || user.role === "admin"; 
//     // tùy backend: 0 hoặc "admin" 
//     } catch { return false; } };
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
    <CartProvider>
    <Header />
    
      <Routes>
        <Route path="/" element={<Home />} />            
        <Route path="/Home" element={<Home />} />              
        <Route path="/products" element={<AllProducts />} /> 
        <Route path="/register" element={<Register />} /> 
        <Route path="/login" element={<Singin />} /> 
        <Route path="/products/:id" element={<ProductDetail />} /> 
        <Route path="/checkout" element={<Checkout />} /> 
        <Route path="/news" element={<ListNews />} /> 
        <Route path="/profile/:id" element={<UserProfile />} /> 
        // Admin Route example
         <Route path="/admin" element={ <AdminLayout><Dashboard /> </AdminLayout>}/>
         <Route path="/admin/products" element={ <AdminLayout><Products /> </AdminLayout>}/>
         <Route path="/admin/users" element={ <AdminLayout><Users /> </AdminLayout>}/>
         <Route path="/admin/categories" element={ <AdminLayout><Categories /> </AdminLayout>}/>
         <Route path="/admin/orders" element={ <AdminLayout><Orders /> </AdminLayout>}/>
         
         {/* <Route path="/admin/images" element={ <AdminLayout><Images /> </AdminLayout>}/> */}
      </Routes>
   </CartProvider>
    {/* <Banner />
    <App /> */}
    <Footer />
    </Router>
  </React.StrictMode>
);

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// // reportWebVitals();
