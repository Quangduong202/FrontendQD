import { Layout } from "antd";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import AdminMenu from "../components/AdminMenu";
import { CartContext } from "../context/CartContext";

const { Header, Sider, Content } = Layout;

function AdminLayout({ children }) {
  const { user } = useContext(CartContext);
  const navigate = useNavigate();

  // // 👉 kiểm tra quyền admin
  // if (!user || user.role !== 2) {
  //   // Nếu không phải admin thì điều hướng về trang chủ hoặc báo lỗi
    
  //   return <p className="text-center mt-4">❌ Bạn không có quyền truy cập trang này</p>;
  //   navigate("/");
  // }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible>
        <div style={{ color: "#fff", padding: 16, fontWeight: "bold" }}>
          ADMIN PANEL
        </div>
        <AdminMenu />
      </Sider>

      <Layout>
        <Header style={{ background: "#fff" }}>
          Admin Dashboard
        </Header>
        <Content style={{ margin: 16 }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}

export default AdminLayout;
