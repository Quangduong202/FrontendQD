import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../context/CartContext";

function Checkout() {
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");

  const {
    cartItems,
    setCartItems,
    total,
    setTotal,
    cartId,
    setCartId,
    refreshCart,
  } = useContext(CartContext);

  const [loading, setLoading] = useState(true);

  // 👉 Chỉ gọi refreshCart một lần khi component mount
  useEffect(() => {
    const fetchCart = async () => {
      try {
        await refreshCart();
      } catch (err) {
        console.error("❌ Cart error:", err.message);
        alert(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
    // ❌ bỏ navigate, accessToken khỏi dependency để tránh gọi lại liên tục
  }, []);

  // 👉 Tính tổng tiền từ cartItems
  const getTotalPrice = () => {
    return cartItems.reduce(
      (sum, item) => sum + item.quantity * (item.product?.price || 0),
      0
    );
  };

  // 👉 Checkout
  const handleCheckout = async () => {
    try {
      const payload = {
        cart_id: parseInt(cartId),
        total_price: getTotalPrice(),
      };

      console.log("📤 Checkout payload:", payload);

      const res = await fetch("http://localhost:3000/api/cart/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("📥 Checkout response:", data);

      if (!res.ok) throw new Error(data.message || "Checkout failed");

      alert("✅ Đặt hàng thành công!");
      localStorage.removeItem("cartId");

      // 👉 reset giỏ hàng sau khi checkout
      setCartItems([]);
      setTotal(0);
      setCartId(null);

      navigate("/");
    } catch (err) {
      console.error("❌ Checkout error:", err.message);
      alert(err.message);
    }
  };

  // 👉 Render UI
  if (loading) return <p className="text-center mt-4">Đang tải giỏ hàng...</p>;
  if (!cartItems.length) return <p className="text-center mt-4">Giỏ hàng trống</p>;

  return (
    <div className="checkout-wrapper container mt-5">
      <div className="card shadow-lg">
        <div className="card-header bg-primary text-white">
          <h2 className="mb-0">🛒 Thanh toán</h2>
        </div>
        <div className="card-body">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Sản phẩm</th>
                <th>Giá</th>
                <th>Số lượng</th>
                <th>Tạm tính</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.product?.name}</td>
                  <td className="text-success">
                    {item.product?.price?.toLocaleString()} đ
                  </td>
                  <td>{item.quantity}</td>
                  <td className="text-danger">
                    {(item.quantity * (item.product?.price || 0)).toLocaleString()} đ
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="d-flex justify-content-between align-items-center mt-4">
            <h4 className="mb-0">
              Tổng tiền:{" "}
              <span className="text-primary">
                {getTotalPrice().toLocaleString()} đ
              </span>
            </h4>
            <button
              className="btn btn-lg btn-success px-4"
              onClick={handleCheckout}
            >
              ✅ Đặt hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
