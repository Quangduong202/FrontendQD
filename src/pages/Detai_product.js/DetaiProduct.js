import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import "./DetaiProduct.css"; // 👉 tạo file CSS riêng

function DetailProduct() {
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const { id } = useParams();
  const { cartId, refreshCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/products/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Không thể tải sản phẩm");
        setProduct(data.data || data);
      } catch (err) {
        console.error("❌ Lỗi khi lấy sản phẩm:", err.message);
        alert(`Lỗi backend: ${err.message}`);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) return <p>⏳ Đang tải sản phẩm...</p>;

  const handleAddToCart = async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!cartId || !accessToken) {
      alert("❌ Không tìm thấy giỏ hàng hoặc chưa đăng nhập.");
      return;
    }
    try {
      const payload = {
        cart_id: Number(cartId),
        product_id: product.id,
        quantity,
      };
      const res = await fetch("http://localhost:3000/api/cart-item", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Không thể thêm vào giỏ hàng");
        return;
      }
      alert("✅ Đã thêm sản phẩm vào giỏ hàng!");
      refreshCart();
    } catch (err) {
      console.error("❌ Lỗi khi thêm vào giỏ hàng:", err);
      alert(`Lỗi backend: ${err.message}`);
    }
  };

  return (
    <div className="detail-product container">
      <div className="row">
        {/* Hình ảnh sản phẩm */}
        <div className="col-lg-6 col-md-12">
          <div className="product-image-box">
            <img
              src={`http://localhost:3000/api/images/${product.image}`}
              alt={product.name}
              className="main-image"
            />
          </div>
        </div>

        {/* Thông tin sản phẩm */}
        <div className="col-lg-6 col-md-12">
          <div className="product-info-box">
            <h2 className="product-title">{product.name}</h2>
            <p className="product-category">
              <i className="lni lni-tag"></i> {product.category}
            </p>
            <h3 className="product-price">
              ${product.price}{" "}
              {product.oldPrice && (
                <span className="old-price">${product.oldPrice}</span>
              )}
            </h3>
            <p className="product-description">{product.description}</p>

            {/* Chọn số lượng */}
            <div className="quantity-box">
              <label>Số lượng:</label>
              <select
                className="form-control"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              >
                {[1, 2, 3, 4, 5].map((q) => (
                  <option key={q} value={q}>
                    {q}
                  </option>
                ))}
              </select>
            </div>

            {/* Nút hành động */}
            <div className="action-buttons">
              <button className="btn btn-primary" onClick={handleAddToCart}>
                <i className="lni lni-cart"></i> Thêm vào giỏ
              </button>
              <button className="btn btn-outline-secondary">
                <i className="lni lni-reload"></i> So sánh
              </button>
              <button className="btn btn-outline-danger">
                <i className="lni lni-heart"></i> Yêu thích
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailProduct;
