import { Drawer } from "antd"; // dùng Drawer để hiển thị chi tiết

const [orderDetails, setOrderDetails] = useState([]);
const [selectedOrder, setSelectedOrder] = useState(null);
const [isDrawerVisible, setIsDrawerVisible] = useState(false);

// Hàm lấy chi tiết đơn hàng
const fetchOrderDetails = async (orderId) => {
  const res = await fetch(`http://localhost:3000/api/order-detail/order/${orderId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
  const data = await res.json();
  setOrderDetails(data.data || []);
  setIsDrawerVisible(true);
};

// Sửa lại actionButtons
const actionButtons = (text, record) => (
  <>
    <Button type="link" onClick={() => {
      setEditingOrder(record);
      form.setFieldsValue(record);
      setIsModalVisible(true);
    }}>
      Sửa
    </Button>
    <Button type="link" onClick={() => {
      setSelectedOrder(record);
      fetchOrderDetails(record.id);
    }}>
      Xem chi tiết
    </Button>
    <Popconfirm title="Xóa đơn hàng này?" onConfirm={() => handleDelete(record.id)}>
      <Button danger type="link">Xóa</Button>
    </Popconfirm>
  </>
);
