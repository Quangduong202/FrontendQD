// src/components/ProductTrending.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../pages/productlists/productlist.css";
import ProductCard from "../productcart/productCart";

function ProductTrending() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 👉 Fetch sản phẩm trending dựa vào buyturn
  useEffect(() => {
    const fetchTrendingProducts = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/products");
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Không thể tải sản phẩm");
        }

        // 👉 Sắp xếp theo buyturn giảm dần và lấy top 8
        const sorted = (data.data || data)
          .sort((a, b) => b.buyturn - a.buyturn)
          .slice(0, 8);

        setProducts(sorted);
      } catch (err) {
        console.error("❌ Lỗi khi lấy sản phẩm trending:", err.message);
        alert(`Lỗi backend: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingProducts();
  }, []);

  if (loading) return <p>⏳ Đang tải sản phẩm nổi bật...</p>;

  return (
    <div className="product-trending section">
      <div className="container">
        <div className="row g-4">
          {products.length > 0 ? (
            products.map((product) => (
               <ProductCard key={product.id} product={product}/> 
            ))
          ) : (
            <div className="col-12">
              <p style={{ textAlign: "center", padding: "20px" }}>
                Không có sản phẩm nổi bật nào.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductTrending;
