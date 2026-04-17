import {
  Table,
  Button,
  Popconfirm,
  message,
  Modal,
  Form,
  Input,
  Select,
} from "antd";
import { useEffect, useState } from "react";

const { Search } = Input;

function Orders() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null); // 👉 đơn hàng được click để xem chi tiết
  const [isDetailVisible, setIsDetailVisible] = useState(false); // 👉 modal chi tiết
  const [form] = Form.useForm();
    const [orderDetails, setOrderDetails] = useState([]); 
  // READ orders
  const fetchOrders = () => {
    fetch("https://voquangduong-2122110372-c-22.onrender.com/Order", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setOrders(data.data);
        setFilteredOrders(data.data);
      });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // SEARCH
  const handleSearch = (value) => {
    const keyword = value.toLowerCase();
    const filtered = orders.filter(
      (o) =>
        o.note?.toLowerCase().includes(keyword) ||
        o.sessions_id?.toLowerCase().includes(keyword)
    );
    setFilteredOrders(filtered);
  };

  // CREATE or UPDATE
  const handleSave = async () => {
    const values = await form.validateFields();
    const method = editingOrder ? "PUT" : "POST";
    const url = editingOrder
      ? `https://voquangduong-2122110372-c-22.onrender.com/Order/${editingOrder.id}`
      : "https://voquangduong-2122110372-c-22.onrender.com/Order";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify(values),
    });

    await res.json();
    message.success(
      editingOrder ? "Cập nhật đơn hàng thành công" : "Tạo đơn hàng mới thành công"
    );
    setIsModalVisible(false);
    setEditingOrder(null);
    form.resetFields();
    fetchOrders();
  };

  // DELETE
  const handleDelete = async (id) => {
    await fetch(`https://voquangduong-2122110372-c-22.onrender.com/Order/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    setOrders(orders.filter((o) => o.id !== id));
    setFilteredOrders(filteredOrders.filter((o) => o.id !== id));
    message.success("Xóa đơn hàng thành công");
  };

  // Action buttons
  const actionButtons = (text, record) => (
    <>
      <Button
        type="link"
        onClick={() => {
          setEditingOrder(record);
          form.setFieldsValue(record);
          setIsModalVisible(true);
        }}
      >
        Sửa
      </Button>
      <Popconfirm
        title="Xóa đơn hàng này?"
        onConfirm={() => handleDelete(record.id)}
      >
        <Button danger type="link">
          Xóa
        </Button>
      </Popconfirm>
    </>
  );

  const columns = [
    { title: "Mã đơn hàng", dataIndex: "id" },
    {
      title: "Người dùng",
      dataIndex: "user",
      render: (user) => user?.name,
    },
    { title: "Ghi chú", dataIndex: "note" },
    {
      title: "Tổng tiền",
      dataIndex: "total",
      render: (value) => `${value.toLocaleString()}₫`,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status) => {
        const statusMap = {
          0: "Chờ xử lý",
          1: "Đã xác nhận",
          2: "Đang giao",
          3: "Hoàn tất",
          4: "Đã hủy",
        };
        return statusMap[status] || "Không xác định";
      },
    },
    { title: "sessions_id", dataIndex: "sessions_id" },
    { title: "Ngày tạo", dataIndex: "createdAt" },
    { title: "Ngày cập nhật", dataIndex: "updatedAt" },
    { title: "Hành động", render: actionButtons },
  ];
 // 👉 Lấy chi tiết sản phẩm trong đơn hàng
  const fetchOrderDetail = async (orderId) => {
    try {
      const res = await fetch(`https://voquangduong-2122110372-c-22.onrender.com/Order-detail/${orderId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      const data = await res.json();
      setOrderDetails(Array.isArray(data.data?.orderdetails) ? data.data.orderdetails : []);
      console.log("✅ Chi tiết đơn hàng:", data);
    } catch (err) {
      console.error("❌ Lỗi khi lấy chi tiết đơn hàng:", err.message);
      message.error("Không thể tải chi tiết đơn hàng");
    }
  };

  return (
    <>
      <div
        style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}
      >
        <Search
          placeholder="Tìm theo ghi chú hoặc phiên giao dịch"
          onSearch={handleSearch}
          style={{ width: 300 }}
          allowClear
        />
      </div>

      <Table
        columns={columns}
        dataSource={filteredOrders}
        rowKey="id"
        scroll={{ x: true }}
        onRow={(record) => ({
          onClick: () => {
            setSelectedOrder(record);
            fetchOrderDetail(record.id); 
            setIsDetailVisible(true);
          },
        })}
      />

      {/* Modal tạo/sửa */}
      <Modal
        title={editingOrder ? "Sửa đơn hàng" : "Tạo đơn hàng"}
        open={isModalVisible}
        onOk={handleSave}
        onCancel={() => setIsModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="user_id" label="User ID">
            <Input />
          </Form.Item>
          <Form.Item name="note" label="Ghi chú">
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            name="total"
            label="Tổng tiền"
            rules={[{ required: true }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value={0}>Chờ xử lý</Select.Option>
              <Select.Option value={1}>Đã xác nhận</Select.Option>
              <Select.Option value={2}>Đang giao</Select.Option>
              <Select.Option value={3}>Hoàn tất</Select.Option>
              <Select.Option value={4}>Đã hủy</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="sessions_id" label="Session ID">
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal chi tiết đơn hàng */}
      <Modal
        title="Chi tiết đơn hàng"
        open={isDetailVisible}
        onCancel={() => setIsDetailVisible(false)}
        footer={null}
        width={600}
      >
        {selectedOrder && (
  <div>
    <p><b>Mã đơn hàng:</b> {selectedOrder.id}</p>
    <p><b>Người dùng:</b> {selectedOrder.user?.name}</p>
    <p><b>Ghi chú:</b> {selectedOrder.note}</p>
    <p><b>Tổng tiền:</b> {selectedOrder.total?.toLocaleString()}₫</p>
    <p><b>Trạng thái:</b> {selectedOrder.status}</p>
    <p><b>Session ID:</b> {selectedOrder.sessions_id}</p>
    <p><b>Ngày tạo:</b> {selectedOrder.createdAt}</p>
    <p><b>Ngày cập nhật:</b> {selectedOrder.updatedAt}</p>

    <h4 className="mt-3">Danh sách sản phẩm trong đơn hàng:</h4>
    <Table
      dataSource={orderDetails || []}
      rowKey="id"
      pagination={false}
      columns={[
        {
          title: "Tên sản phẩm",
          dataIndex: ["product", "name"],
        },
        {
          title: "Giá",
          dataIndex: ["product", "price"],
          render: (value) => `${value?.toLocaleString()}₫`,
        },
        {
          title: "Số lượng",
          dataIndex: "quantity",
        },
        {
          title: "Thành tiền",
          render: (record) =>
            (record.quantity * (record.product?.price || 0)).toLocaleString() + "₫",
        },
      ]}
    />
  </div>
)}

      </Modal>
    </>
  );
}

export default Orders;
