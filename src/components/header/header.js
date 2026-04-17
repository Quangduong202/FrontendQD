
// import './header.css';
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import Category from "../categorys/category";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
function Header() {
const [query, setQuery] = useState("");
  const navigate = useNavigate();

  // 👉 lấy dữ liệu giỏ hàng từ Context
  // const { cartItems, total, cartId, refreshCart } = useContext(CartContext);
  const { cartItems, setCartItems, total, setTotal, cartId, setCartId, refreshCart } = useContext(CartContext);

  
  // 👉 state user, khởi tạo từ localStorage
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Hàm tìm kiếm
  const handleSearch = () => {
    const keyword = query.trim();
    if (!keyword) return;
    navigate(`/products?search=${keyword}`);
  };

  // Hàm logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("cartId");
    localStorage.removeItem("session_id");

    setUser(null); // 👉 reset state user
    window.location.href = "/login";
  };

  // Hàm xóa item khỏi giỏ hàng
  const handleRemoveItem = async (productId) => {
  try {
    const res = await fetch(
      `http://localhost:3000/api/cart-item/${cartId}/${productId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );

    if (res.ok) {
      console.log(`✅ Đã xóa sản phẩm ${productId} khỏi giỏ hàng ${cartId}`);

      // 👉 cập nhật lại giỏ hàng ngay tại client
      const newCartItems = cartItems.filter(
        (item) => item.product_id !== productId
      );
      setCartItems(newCartItems);

      const newTotal = newCartItems.reduce(
        (sum, item) => sum + item.quantity * (item.product?.price || 0),
        0
      );
      setTotal(newTotal);

      // 👉 nếu giỏ hàng rỗng thì reset cartId
      if (newCartItems.length === 0) {
        setCartId(null);
        localStorage.removeItem("cartId");
        console.warn("⚠️ Giỏ hàng hiện tại trống.");
      }
    } else {
      const errorData = await res.json();
      if (errorData.message?.includes("Không tìm thấy sản phẩm")) {
        console.warn("⚠️ Item không tồn tại trong giỏ hàng, bỏ qua.");
        return;
      }
      console.error("❌ Lỗi xóa item:", errorData.message || "Không rõ lỗi");
    }
  } catch (err) {
    console.error("❌ Lỗi kết nối khi xóa item:", err);
  }
};


  return (
    <div className="App">
        <header class="header navbar-area">
        {/* <!-- Start Topbar --> */}
        <div class="topbar">
            <div class="container">
                <div class="row align-items-center">
                    <div class="col-lg-4 col-md-4 col-12">
                        <div class="top-left">
                            <ul class="menu-top-link">
                                <li>
                                    <div class="select-position">
                                        <select id="select4">
                                            <option value="0" selected>$ USD</option>
                                            <option value="1">€ EURO</option>
                                            <option value="2">$ CAD</option>
                                            <option value="3">₹ INR</option>
                                            <option value="4">¥ CNY</option>
                                            <option value="5">৳ BDT</option>
                                        </select>
                                    </div>
                                </li>
                                <li>
                                    <div class="select-position">
                                        <select id="select5">
                                            <option value="0" selected>English</option>
                                            <option value="1">Español</option>
                                            <option value="2">Filipino</option>
                                            <option value="3">Français</option>
                                            <option value="4">العربية</option>
                                            <option value="5">हिन्दी</option>
                                            <option value="6">বাংলা</option>
                                        </select>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="col-lg-4 col-md-4 col-12">
                        <div class="top-middle">
                           
                        </div>
                    </div>
                    <div class="col-lg-4 col-md-4 col-12">
                        <div class="top-end">
                            <div className="user">
  {/* 👉 bọc icon bằng Link */}
  {user ? (
    <Link to={`/profile/${user.id}`} style={{ textDecoration: "none", color: "inherit" }}>
      <i className="lni lni-user"></i>
      <span>Xin chào {user.name}</span>
    </Link>
  ) : (
    <Link to="/login" style={{ textDecoration: "none", color: "inherit" }}>
      <i className="lni lni-user"></i>
      <span>Đăng nhập</span>
    </Link>
  )}
</div>

                            <ul class="user-login">
                                 {!user ? (
                <>
                    <li>
                        <a href="/login">Đăng nhập</a>
                    </li>
                    <li>
                        <a href="/register">Đăng kí</a>
                    </li>
                </>
            ) : (
                <>
                    
                    <li>
                        <button 
                            onClick={handleLogout} 
                            style={{ 
                                background: "none", 
                                border: "none", 
                                color: "#ff4d4f",
                                cursor: "pointer"
                            }}
                        >
                            Đăng xuất
                        </button>
                    </li>
                </>
            )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {/* <!-- End Topbar --> */}
        {/* <!-- Start Header Middle --> */}
        <Category/>
        <div class="header-middle">
            <div class="container">
                <div class="row align-items-center">
                    <div class="col-lg-3 col-md-3 col-7">
                        {/* <!-- Start Header Logo --> */}
                        <a class="navbar-brand" href="main.html">
                            <img src="/images/logo/logo.svg" alt="Logo"/>
                        </a>
                        {/* <!-- End Header Logo --> */}
                    </div>
                    <div class="col-lg-5 col-md-7 d-xs-none">
                        {/* <!-- Start Main Menu Search --> */}
                        <div class="main-menu-search">
                            {/* <!-- navbar search start --> */}
                            <div class="navbar-search search-style-5">
                                <div class="search-select">
                                    <div class="select-position">
                                        <select id="select1">
                                            <option selected>All</option>
                                            <option value="1">option 01</option>
                                            <option value="2">option 02</option>
                                            <option value="3">option 03</option>
                                            <option value="4">option 04</option>
                                            <option value="5">option 05</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="search-input">
                                    <input 
                                            value={query}
                                            onChange={(e) => setQuery(e.target.value)}
                                     type="text" placeholder="Tìm kiếm"/>
                                </div>
                                <div class="search-btn">
                                    <button onClick={handleSearch}><i class="lni lni-search-alt"></i></button>
                                </div>
                            </div>
                            {/* <!-- navbar search Ends --> */}
                        </div>
                        {/* <!-- End Main Menu Search --> */}
                    </div>
                    <div class="col-lg-4 col-md-2 col-5">
                        <div class="middle-right-area">
                            <div class="nav-hotline">
                                <i class="lni lni-phone"></i>
                                <h3>Hotline:
                                    <span>(+100) 123 456 7890</span>
                                </h3>
                            </div>
                            <div class="navbar-cart">
                                <div class="wishlist">
                                    <a href="javascript:void(0)">
                                        <i class="lni lni-heart"></i>
                                        <span class="total-items">0</span>
                                    </a>
                                </div>
                                <div class="cart-items">
                                    <a href="/checkout" class="main-btn">
                                        <i class="lni lni-cart"></i>
                                        <span class="total-items">{cartItems.length}</span>
                                    </a>
                                    {/* <!-- Shopping Item --> */}
                                   <div className="shopping-item">
      <div className="dropdown-cart-header">
        <span>{cartItems.length} Sản phẩm</span>
        <a href="/checkout">Giỏ hàng</a>
      </div>

      <ul className="shopping-list">
        {cartItems.map((item) => (
          <li key={item.id}>
            <a
  href="#"
  className="remove"
  title="Remove this item"
  onClick={(e) => {
    e.preventDefault(); // ngăn reload trang
    handleRemoveItem( item.product_id);
  }}
>
  <i className="lni lni-close"></i>
</a>

            {/* <button type="button" className="remove btn btn-sm btn-outline-danger" title="Remove this item" onClick={() => handleRemoveItem(item.cart_id, item.product_id)} > ❌ Xóa </button>
            <a
              href="javascript:void(0)"
              className="remove"
              title="Remove this item"
              // TODO: thêm hàm xóa item
              onClick={() => handleRemoveItem(item.cart_id, item.product_id)}
            >
              
              
            </a> */}
            <div className="cart-img-head">
              <a className="cart-img" href={`/products/${item.product?.id}`}>
                <img src={`http://localhost:3000/api/images/${item.product?.image}`} alt={item.product?.name} />
              </a>
            </div>
            <div className="content">
              <h4>
                <a href={`/products/${item.product?.id}`}>{item.product?.name}</a>
              </h4>
              <p className="quantity"> Số lượng : 
                {item.quantity} {" "}
                <span className="amount">Đơn giá: {item.product?.price} $</span>
              </p>
            </div>
          </li>
        ))}
      </ul>

      <div className="bottom">
        <div className="total">
          <span>Tổng cộng:</span>
          <span className="total-amount">${total}</span>
        </div>
        <div className="button">
          <a href="/checkout" className="btn animate">
            Thanh toán
          </a>
        </div>
      </div>
    </div>
                                    {/* <!--/ End Shopping Item --> */}
                                </div>
                               
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
        
        {/* <!-- End Header Middle --> */}
        {/* <!-- Start Header Bottom --> */}
        
        {/* <!-- End Header Bottom --> */}
    </header>
     {/* <Category /> */}
    </div>

    );
}

export default Header;