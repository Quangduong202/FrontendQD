import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [cartId, setCartId] = useState(localStorage.getItem("cartId") || null);
  const [user, setUser] = useState(
    localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null
  );

  const accessToken = localStorage.getItem("accessToken");

  // 👉 Hàm fetch giỏ hàng theo cartId
  const fetchCartById = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/api/cart-item/cart/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const data = await res.json();

      if (res.ok && Array.isArray(data.data)) {
        setCartItems(data.data);
        setCartId(id);

        const totalAmount = data.data.reduce(
          (sum, item) => sum + item.quantity * (item.product?.price || 0),
          0
        );
        setTotal(totalAmount);

        localStorage.setItem("cartId", id);
      }
    } catch (err) {
      console.error("❌ Lỗi lấy giỏ hàng:", err);
    }
  };

  // 👉 Hàm tạo giỏ hàng mới nếu chưa có
  const createCart = async () => {
    try {
      const payload = {};
      if (user) {
        payload.user_id = user.id;
      } else {
        let sessionId = localStorage.getItem("session_id");
        if (!sessionId) {
          sessionId = Date.now().toString();
          localStorage.setItem("session_id", sessionId);
        }
        payload.session_id = sessionId;
      }

      const res = await fetch("http://localhost:3000/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.data?.id) {
        setCartId(data.data.id);
        localStorage.setItem("cartId", data.data.id);
        await fetchCartById(data.data.id);
      }
    } catch (err) {
      console.error("❌ Lỗi tạo giỏ hàng:", err);
    }
  };

  // 👉 Hàm refresh giỏ hàng
  const refreshCart = async () => {
    if (!cartId) {
      await createCart();
      return;
    }
    try {
      await fetchCartById(cartId);
    } catch (err) {
      console.error("❌ Lỗi refresh giỏ hàng:", err);
      setCartItems([]);
      setTotal(0);
      setCartId(null);
      localStorage.removeItem("cartId");
    }
  };

  // 👉 Hàm xử lý sau khi đăng nhập thành công
  const handleLoginSuccess = (userData, token) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("accessToken", token);
    setUser(userData);
    // Sau khi login thì tạo giỏ hàng mới gắn với user
    createCart();
  };

  // 👉 Hàm logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("cartId");
    localStorage.removeItem("session_id");
    setUser(null);
    setCartItems([]);
    setTotal(0);
    setCartId(null);
  };

  // 👉 Khởi tạo giỏ hàng khi mount
  useEffect(() => {
    if (cartId) {
      fetchCartById(cartId);
    } else {
      createCart();
    }
  }, [cartId]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        total,
        setTotal,
        cartId,
        setCartId,
        refreshCart,
        user,
        setUser,
        handleLoginSuccess, // 👉 gọi khi login thành công
        handleLogout,       // 👉 gọi khi logout
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
