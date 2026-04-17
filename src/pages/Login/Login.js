import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { message } from "antd";

function Singin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    const res = await axios.post("http://localhost:3000/api/user/login", {
      email,
      password,
    });

    if (res.data?.data) {
      localStorage.setItem("user", JSON.stringify(res.data.data));
    }
    if (res.data?.accessToken) {
      localStorage.setItem("accessToken", res.data.accessToken);
    }

    const accessToken = localStorage.getItem("accessToken");
    console.log("🔑 accessToken:", accessToken);

    const userData = res.data?.data;
    const userName = userData?.name || userData?.username || email;

    message.success(`Xin chào ${userName}, bạn đã đăng nhập thành công!`);

    setTimeout(() => {
      if (userData?.role === 2) {
        // 👉 Nếu role = 2 thì chuyển tới trang admin
        navigate("/admin");
      } else {
        // 👉 Nếu role khác thì về trang chủ
        navigate("/");
      }
      window.location.reload();
    }, 1000);
  } catch (err) {
    setError(
      err.response?.data?.message || "❌ Đăng nhập thất bại, vui lòng thử lại"
    );
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="account-login section">
      <div className="container">
        <div className="row">
          <div className="col-lg-6 offset-lg-3 col-md-10 offset-md-1 col-12">
            <form className="card login-form" onSubmit={handleSubmit}>
              <div className="card-body">
                <div className="title">
                  <h3>Đăng nhập ngay</h3>
                  <p>Bạn có thể đăng nhập bằng địa chỉ email của mình.</p>
                </div>

                {/* ERROR */}
                {error && <div className="alert alert-danger">{error}</div>}

                <div className="form-group input-group">
                  <label>Email</label>
                  <input
                    className="form-control"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group input-group">
                  <label>Mật khẩu</label>
                  <input
                    className="form-control"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="d-flex flex-wrap justify-content-between bottom-content">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input width-auto"
                    />
                    <label className="form-check-label">Ghi nhớ đăng nhập</label>
                  </div>
                  <a className="lost-pass" href="#">
                    Quên mật khẩu?
                  </a>
                </div>

                <div className="button">
                  <button className="btn" type="submit" disabled={loading}>
                    {loading ? "⏳ Đang đăng nhập..." : "Đăng nhập"}
                  </button>
                </div>

                <p className="outer-link">
                  Chưa có tài khoản? <a href="/register">Đăng ký ngay</a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Singin;
