import React, { useEffect, useState } from "react";
import { getAllProducts } from "../../services/productService";
import { getAllBrands } from "../../services/BrandSevice";
import { getAllCategories } from "../../services/CategorySevice";
import './productlist.css';
import { useSearchParams } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import { useContext } from "react";
import ProductCard from "../../components/productcart/productCart";
function ProductList() {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const categoryParam = searchParams.get("category");

  // 👉 state cho phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // số sản phẩm mỗi trang

  useEffect(() => {
    loadProducts();
    loadBrands();
    loadCategories();
    if (categoryParam) {
      setSelectedCategories(categoryParam.split(",").map(Number));
    }
  }, [search, categoryParam]);

  const loadBrands = async () => {
    try {
      const res = await getAllBrands();
      const data = res.data.data || [];
      setBrands(data);
    } catch (err) {
      console.error("Error fetching brands:", err);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await getAllCategories();
      const data = res.data.data || [];
      setCategories(data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const loadProducts = async () => {
    try {
      const res = await getAllProducts({ search });
      const data = res.data.data || [];
      setAllProducts(data);
      setFilteredProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const handleFilterChange = (type, value) => {
    const updateState = (prevState, value) =>
      prevState.includes(value)
        ? prevState.filter((item) => item !== value)
        : [...prevState, value];

    if (type === "category") {
      setSelectedCategories((prev) => updateState(prev, value));
    } else if (type === "brand") {
      setSelectedBrands((prev) => updateState(prev, value));
    }
  };

  useEffect(() => {
    const isCategoryFiltered = selectedCategories.length > 0;
    const isBrandFiltered = selectedBrands.length > 0;

    if (!isCategoryFiltered && !isBrandFiltered) {
      setFilteredProducts(allProducts);
      return;
    }

    const results = allProducts.filter((product) => {
      const productCategoryValue = Number(product.category_id || product.categorySlug);
      const productBrandValue = Number(product.brand_id || product.brandSlug);

      let categoryMatch = true;
      let brandMatch = true;

      if (isCategoryFiltered) {
        categoryMatch = selectedCategories.includes(productCategoryValue);
      }
      if (isBrandFiltered) {
        brandMatch = selectedBrands.includes(productBrandValue);
      }

      return categoryMatch && brandMatch;
    });

    setFilteredProducts(results);
    setCurrentPage(1); // reset về trang 1 khi lọc
  }, [selectedCategories, selectedBrands, allProducts]);

  // 👉 logic phân trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
   const { cartId, refreshCart } = useContext(CartContext);
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

const handleQuantityChange = (productId, delta) => {
  setFilteredProducts(prev =>
    prev.map(p =>
      p.id === productId
        ? { ...p, quantity: Math.max(1, (p.quantity || 1) + delta) }
        : p
    )
  );
};

const handleAddToCart = (product, quantity) => {
  // gọi API thêm vào giỏ với số lượng đã chọn
  console.log("Thêm vào giỏ:", product.name, "Số lượng:", quantity);
};

  return (
    <div className="main-content-area">
      {/* Sidebar lọc */}
      <div className="filter-panel sidebar-col">
        <h3>Bộ Lọc Sản Phẩm</h3>
        {/* Category */}
        <div className="filter-group">
          <h4>Danh mục</h4>
          <div className="filter-options">
            {categories.map((category) => {
              const isChecked1 = selectedCategories.includes(category.id);
              return (
                <label key={category.id}>
                  <input
                    type="checkbox"
                    value={category.id}
                    checked={isChecked1}
                    onChange={() => handleFilterChange("category", category.id)}
                  />
                  {category.name}
                </label>
              );
            })}
          </div>
        </div>
        {/* Brand */}
        <div className="filter-group">
          <h4>Thương hiệu</h4>
          <div className="filter-options">
            {brands.map((brand) => {
              const isChecked = selectedBrands.includes(brand.id);
              return (
                <label key={brand.id} className="filter-option">
                  <input
                    type="checkbox"
                    value={brand.id}
                    checked={isChecked}
                    onChange={() => handleFilterChange("brand", brand.id)}
                  />
                  <span>{brand.name}</span>
                </label>
              );
            })}
          </div>
        </div>
      </div>

      {/* Hiển thị sản phẩm */}
      <div className="product-display-col">
        <h2 className="parent">Tất Cả Sản Phẩm ({filteredProducts.length})</h2>

        <div className="row">
           {currentProducts.length > 0 ? (
    currentProducts.map((product) => (
      <ProductCard
        key={product.id}
        product={product}
        
         />
          ))
          ) : (
        <div className="col-12">
      <p style={{ padding: "20px", textAlign: "center" }}>
        Không tìm thấy sản phẩm nào phù hợp với bộ lọc hiện tại.
      </p>
    </div>
  )}
        </div>

        {/* 👉 Phân trang */}
        {/* 👉 Phân trang */}
{totalPages > 1 && (
  <div className="pagination mt-4 text-center">
    <ul className="pagination-list">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <li key={page}>
          <button
            className={`page-btn ${page === currentPage ? "active" : ""}`}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </button>
        </li>
      ))}
    </ul>
  </div>
)}

      </div>
    </div>
  );
}

export default ProductList;
