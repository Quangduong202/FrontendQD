import React, { useState, useContext } from "react";
import "../../pages/productlists/productlist.css";
import { CartContext } from "../../context/CartContext";

function ProductCard({ product = {} }) {
  const { cartId, refreshCart } = useContext(CartContext);
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

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

      alert(`✅ Đã thêm ${quantity} sản phẩm "${product.name}" vào giỏ hàng!`);
      refreshCart();
    } catch (err) {
      console.error("❌ Lỗi khi thêm vào giỏ hàng:", err);
      alert(`Lỗi backend: ${err.message}`);
    }
  };

  return (
    <div className="col-lg-3 col-md-6 col-12">
      <div className="single-product">
        <div className="product-image">
          <img
            src={
              product.image
                ? `http://localhost:3000/api/images/${product.image}`
                : "/placeholder.png"
            }
            alt={product.name || "Sản phẩm"}
          />
          <div className="button">
            <button className="btn" onClick={handleAddToCart}>
              <i className="lni lni-cart"></i> Thêm vào giỏ
            </button>
          </div>
        </div>

        <div className="product-info">
          <span className="category">{product.categoryName || "Danh mục"}</span>
          <h4 className="title">
            <a href={product.id ? `/products/${product.id}` : "#"}>
              {product.name || "Tên sản phẩm"}
            </a>
          </h4>
          <div className="price">
            <span>${product.price ?? 0}</span>
          </div>

          <div className="quantity-control mt-2">
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1}
            >
              -
            </button>
            <span className="mx-2">{quantity}</span>
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => handleQuantityChange(1)}
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
