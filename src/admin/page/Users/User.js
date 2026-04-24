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

function Users() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();

  // READ users
  const fetchUsers = () => {
    fetch("https://voquangduong-2122110372-c-1-hsnq.onrender.com/api/User")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.data);
        setFilteredUsers(data.data);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // SEARCH
  const handleSearch = (value) => {
    const keyword = value.toLowerCase();
    const filtered = users.filter(
      (u) =>
        u.username?.toLowerCase().includes(keyword) ||
        u.email?.toLowerCase().includes(keyword) ||
        u.name?.toLowerCase().includes(keyword)
    );
    setFilteredUsers(filtered);
  };

  // CREATE or UPDATE
  const handleSave = async () => {
    const values = await form.validateFields();
    const method = editingUser ? "PUT" : "POST";
          const url = editingUser
            ? `https://voquangduong-2122110372-c-1-hsnq.onrender.com/api/User/${editingUser.id}`
      : "https://voquangduong-2122110372-c-1-hsnq.onrender.com/api/User";

    const payload = {
      ...values,
    
    };

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify(payload),
    });

    await res.json();
    message.success(editingUser ? "Updated successfully" : "Created successfully");
    setIsModalVisible(false);
    setEditingUser(null);
    form.resetFields();
    fetchUsers();
  };

  // DELETE
  const handleDelete = async (id) => {
    await fetch(`https://voquangduong-2122110372-c-1-hsnq.onrender.com/api/User/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    setUsers(users.filter((u) => u.id !== id));
    setFilteredUsers(filteredUsers.filter((u) => u.id !== id));
    message.success("Deleted successfully");
  };

  // Action buttons
  const actionButtons = (text, record) => (
    <>
      <Button
        type="link"
        onClick={() => {
          setEditingUser(record);
          form.setFieldsValue(record);
          setIsModalVisible(true);
        }}
      >
        Edit
      </Button>
      <Popconfirm
        title="Delete user?"
        onConfirm={() => handleDelete(record.id)}
      >
        <Button danger type="link">
          Delete
        </Button>
      </Popconfirm>
    </>
  );

  const columns = [
  { title: "Mã người dùng", dataIndex: "id" },
  { title: "Tên đăng nhập", dataIndex: "username" },
  { title: "Email", dataIndex: "email" },
  { title: "Họ và tên", dataIndex: "name" },
  { title: "Số điện thoại", dataIndex: "phone" },
  { title: "Vai trò", dataIndex: "role" },
  {
    title: "Ảnh đại diện",
    dataIndex: "avatar",
    render: (url) => url && <img src={url} alt="avatar" width={40} />
  },
  { title: "Ngày tạo", dataIndex: "createdAt" },
  { title: "Ngày cập nhật", dataIndex: "updatedAt" },
  { title: "Hành động", render: actionButtons },
];


  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <Search
          placeholder="Search by username, email or name"
          onSearch={handleSearch}
          style={{ width: 300 }}
          allowClear
        />
        <Button
          type="primary"
          onClick={() => {
            setEditingUser(null);
            form.resetFields();
            setIsModalVisible(true);
          }}
        >
          Add User
        </Button>
      </div>

      <Table columns={columns} dataSource={filteredUsers} rowKey="id" scroll={{ x: true }} />

      <Modal
        title={editingUser ? "Edit User" : "Add User"}
        open={isModalVisible}
        onOk={handleSave}
        onCancel={() => setIsModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="username" label="Username" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: !editingUser }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item name="name" label="Full Name">
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Phone">
            <Input />
          </Form.Item>
          <Form.Item name="role" label="Role" rules={[{ required: true }]}>
            <Select placeholder="Select role">
              <Select.Option value={1}>Admin</Select.Option>
              <Select.Option value={2}>User</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="avatar" label="Avatar URL">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default Users;
