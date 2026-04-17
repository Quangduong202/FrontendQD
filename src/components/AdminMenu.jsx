import { Menu } from "antd";
import {
    DashboardOutlined,
    ShoppingOutlined,
    AppstoreOutlined,
    UserOutlined,
    ShoppingCartOutlined,
    PictureOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";

function AdminMenu() {
    const location = useLocation();

    return (
        <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[location.pathname]}
            items={[
                {
                    key: "/admin",
                    icon: <DashboardOutlined />,
                    label: <Link to="/admin">Dashboard</Link>,
                },
                {
                    key: "/admin/products",
                    icon: <ShoppingOutlined />,
                    label: <Link to="/admin/products">Products</Link>,
                },
                {
                    key: "/admin/categories",
                    icon: <AppstoreOutlined />,
                    label: <Link to="/admin/categories">Categories</Link>,
                },
                {
                    key: "/admin/orders",
                    icon: <ShoppingCartOutlined />,
                    label: <Link to="/admin/orders">Orders</Link>,
                },
                {
                    key: "/admin/users",
                    icon: <UserOutlined />,
                    label: <Link to="/admin/users">Users</Link>,
                },
                { key: "/admin/images", 
                    icon: <PictureOutlined />,
                    label: <Link to="/admin/images">Images</Link>, },
            ]}
        />
    );
}

export default AdminMenu;
