import React, { useEffect, useState } from "react"; 
import { Link, useNavigate } from "react-router-dom"; 
import { getAllCategories } from "../../services/CategorySevice";

function Category() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate(); 

  const handleCategoryClick = (catId) => {
    // Chuyển sang trang /products và truyền category đã chọn
    navigate("/products", { state: { selectedCategory: catId } });
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getAllCategories();
        setCategories(res.data.data || []);
      } catch (err) {
        console.error("❌ Lỗi khi tải danh mục:", err);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="header navbar-area">
      <div className="container">
        <div className="row align-items-center">
          {/* Menu danh mục */}
          <div className="col-lg-8 col-md-6 col-12">
            <div className="nav-inner">
              {/* Mega Category Menu */}
              <div className="mega-category-menu">
                <span className="cat-button">
                  <i className="lni lni-menu"></i> Tất cả danh mục
                </span>
                <ul className="sub-category">
                  {categories.map((cat) => (
                    <li key={cat.id}>
                      <Link to={`/products?category=${cat.id}`}>
                        {cat.name} <i className="lni lni-chevron-right"></i>
                      </Link>
                      {cat.children && cat.children.length > 0 && (
                        <ul className="inner-sub-category">
                          {cat.children.map((sub) => (
                            <li key={sub.id}>
                              <Link to={`/products?category=${sub.id}`}>
                                {sub.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Navbar */}
              <nav className="navbar navbar-expand-lg">
                <button
                  className="navbar-toggler mobile-menu-btn"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#navbarSupportedContent"
                  aria-controls="navbarSupportedContent"
                  aria-expanded="false"
                  aria-label="Toggle navigation"
                >
                  <span className="toggler-icon"></span>
                  <span className="toggler-icon"></span>
                  <span className="toggler-icon"></span>
                </button>
                <div
                  className="collapse navbar-collapse sub-menu-bar"
                  id="navbarSupportedContent"
                >
                  <ul id="nav" className="navbar-nav ms-auto">
                    <li className="nav-item">
                      <a href="/Home" aria-label="Toggle navigation">
                        Trang chủ
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className="dd-menu collapsed"
                        href="/Pages"
                        data-bs-toggle="collapse"
                        data-bs-target="#submenu-1-2"
                        aria-controls="navbarSupportedContent"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                      >
                        Trang
                      </a>
                      <ul className="sub-menu collapse" id="submenu-1-2">
                        <li className="nav-item">
                          <Link to="/about-us">Giới thiệu</Link>
                        </li>
                        <li className="nav-item">
                          <Link to="/products">Sản phẩm</Link>
                        </li>
                        <li className="nav-item">
                          <Link to="/login">Đăng nhập</Link>
                        </li>
                        <li className="nav-item">
                          <Link to="/register">Đăng ký</Link>
                        </li>
                        <li className="nav-item">
                          <Link to="/mail-success">Gửi mail thành công</Link>
                        </li>
                        <li className="nav-item">
                          <Link to="/404">Lỗi 404</Link>
                        </li>
                      </ul>
                    </li>
                    <li className="nav-item">
                      <a
                        className="dd-menu collapsed"
                        href="/shop"
                        data-bs-toggle="collapse"
                        data-bs-target="#submenu-1-3"
                        aria-controls="navbarSupportedContent"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                      >
                        Cửa hàng
                      </a>
                      <ul className="sub-menu collapse" id="submenu-1-3">
                        <li className="nav-item">
                          <Link to="/product-grids">Dạng lưới</Link>
                        </li>
                        <li className="nav-item">
                          <Link to="/product-list">Dạng danh sách</Link>
                        </li>
                        <li className="nav-item">
                          <Link to="/product-details">Chi tiết sản phẩm</Link>
                        </li>
                        <li className="nav-item">
                          <Link to="/cart">Giỏ hàng</Link>
                        </li>
                        <li className="nav-item">
                          <Link to="/checkout">Thanh toán</Link>
                        </li>
                      </ul>
                    </li>
                    <li className="nav-item">
                      <a
                        className="dd-menu collapsed"
                        href="/blog"
                        data-bs-toggle="collapse"
                        data-bs-target="#submenu-1-4"
                        aria-controls="navbarSupportedContent"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                      >
                        Blog
                      </a>
                      <ul className="sub-menu collapse" id="submenu-1-4">
                        <li className="nav-item">
                          <Link to="/blog-grid-sidebar">Blog dạng lưới</Link>
                        </li>
                        <li className="nav-item">
                          <Link to="/blog-single">Bài viết</Link>
                        </li>
                        <li className="nav-item">
                          <Link to="/blog-single-sidebar">Blog có sidebar</Link>
                        </li>
                      </ul>
                    </li>
                    <li className="nav-item">
                      <a href="/contact" aria-label="Toggle navigation">
                        Liên hệ
                      </a>
                    </li>
                  </ul>
                </div>
              </nav>
            </div>
          </div>

          {/* Social */}
          <div className="col-lg-4 col-md-6 col-12">
            <div className="nav-social">
              <h5 className="title">Theo dõi chúng tôi:</h5>
              <ul>
                <li>
                  <a href="javascript:void(0)">
                    <i className="lni lni-facebook-filled"></i>
                  </a>
                </li>
                <li>
                  <a href="javascript:void(0)">
                    <i className="lni lni-twitter-original"></i>
                  </a>
                </li>
                <li>
                  <a href="javascript:void(0)">
                    <i className="lni lni-instagram"></i>
                  </a>
                </li>
                <li>
                  <a href="javascript:void(0)">
                    <i className="lni lni-skype"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Category;
