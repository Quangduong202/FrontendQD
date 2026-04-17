import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function UserProfile() {
  const { id } = useParams(); // 👈 lấy user id từ URL
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderLoading, setOrderLoading] = useState(true);
  const [error, setError] = useState("");
  const [orderError, setOrderError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/user/${id}`);
        setUser(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "❌ Lỗi khi tải dữ liệu người dùng");
      } finally {
        setLoading(false);
      }
    };

    const fetchOrders = async () => { // /order/user/:user_id
      try {
        const res = await axios.get(`http://localhost:3000/api/order/user/${id}`);
        setOrders(res.data.data || []);
      } catch (err) {
        setOrderError(err.response?.data?.message || "❌ Lỗi khi tải đơn hàng");
      } finally {
        setOrderLoading(false);
      }
    };

    fetchUser();
    fetchOrders();
  }, [id]);

  if (loading) return <p>⏳ Đang tải thông tin người dùng...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="container mt-4">
      <h2>Thông tin người dùng</h2>

      {user ? (
        <div className="card p-3 mb-4">
          <div className="row">
            <div className="col-md-3 text-center">
              <img
                src={user.avatar || "/placeholder.png"}
                alt={user.name}
                className="img-fluid rounded-circle"
              />
            </div>

            <div className="col-md-9">
              <p><strong>Tên đăng nhập:</strong> {user.username}</p>
              <p><strong>Họ và tên:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Số điện thoại:</strong> {user.phone}</p>
              <p>
                <strong>Vai trò:</strong>{" "}
                {user.role === 1 ? "Người dùng" : "Quản trị viên"}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <p>Không tìm thấy thông tin người dùng.</p>
      )}

      <h3>📦 Đơn hàng đã đặt</h3>
      {orderLoading ? (
        <p>⏳ Đang tải đơn hàng...</p>
      ) : orderError ? (
        <p style={{ color: "red" }}>{orderError}</p>
      ) : orders.length > 0 ? (
        <table className="table table-bordered mt-3">
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Ngày đặt</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{new Date(order.createdAt).toLocaleString()}</td>
                <td>{order.totalAmount?.toLocaleString()} VND</td>
                <td>{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>❌ Bạn chưa có đơn hàng nào.</p>
      )}
    </div>
  );
}

export default UserProfile;
