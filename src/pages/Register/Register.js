import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    phone: "",
    avatar: "",
    password: "",
    confirmPassword: "",
    role: 1, // mặc định là USER
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("❌ Mật khẩu xác nhận không khớp");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post("https://voquangduong-2122110372-c-1-hsnq.onrender.com/User/register", {
        username: formData.username,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        avatar: formData.avatar,
        password: formData.password,
        role: formData.role,
      });

      if (res.status === 201 || res.data.success) {
        setSuccess("✅ Đăng ký thành công! Bạn sẽ được chuyển sang trang đăng nhập...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError(res.data.message || "❌ Đăng ký thất bại");
      }
    } catch (err) {
      setError(err.response?.data?.message || "❌ Lỗi kết nối đến máy chủ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="breadcrumbs">
        <div className="container">
          <h1 className="page-title">Đăng ký tài khoản</h1>
        </div>
      </div>

      <div className="account-login section">
        <div className="container">
          <div className="register-form">
            <div className="title">
              <h3>Chưa có tài khoản? Đăng ký ngay</h3>
              <p>Đăng ký chỉ mất chưa đầy một phút nhưng giúp bạn quản lý đơn hàng dễ dàng hơn.</p>
            </div>

            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}

            <form className="row" onSubmit={handleSubmit}>
              <div className="col-sm-6">
                <div className="form-group">
                  <label>Tên đăng nhập</label>
                  <input
                    className="form-control"
                    type="text"
                    id="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="col-sm-6">
                <div className="form-group">
                  <label>Họ và tên</label>
                  <input
                    className="form-control"
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="col-sm-6">
                <div className="form-group">
                  <label>Email</label>
                  <input
                    className="form-control"
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="col-sm-6">
                <div className="form-group">
                  <label>Số điện thoại</label>
                  <input
                    className="form-control"
                    type="text"
                    id="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="col-sm-6">
                <div className="form-group">
                  <label>Ảnh đại diện (URL)</label>
                  <input
                    className="form-control"
                    type="text"
                    id="avatar"
                    value={formData.avatar}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="col-sm-6">
                <div className="form-group">
                  <label>Mật khẩu</label>
                  <input
                    className="form-control"
                    type="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="col-sm-6">
                <div className="form-group">
                  <label>Xác nhận mật khẩu</label>
                  <input
                    className="form-control"
                    type="password"
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="button">
                <button className="btn" type="submit" disabled={loading}>
                  {loading ? "⏳ Đang đăng ký..." : "Đăng ký"}
                </button>
              </div>

              <p className="outer-link">
                Đã có tài khoản? <a href="/login">Đăng nhập ngay</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
