import {
  Table,
  Button,
  Popconfirm,
  message,
  Modal,
  Form,
  Input,
} from "antd";
import { useEffect, useState } from "react";

const { Search } = Input;

function Categories() {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form] = Form.useForm();

  // ================= FETCH =================
  const fetchCategories = async (retry = 0) => {
    try {
      const res = await fetch(
        "https://voquangduong-2122110372-c-1-hsnq.onrender.com/Category"
      );

      if (!res.ok) throw new Error("API lỗi");

      const data = await res.json();

      const list = Array.isArray(data) ? data : data.data;

      setCategories(list || []);
      setFilteredCategories(list || []);
    } catch (err) {
      console.error("FETCH ERROR:", err);

      if (retry < 2) {
        setTimeout(() => fetchCategories(retry + 1), 3000);
      } else {
        message.error("Không load được dữ liệu");
      }
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ================= SEARCH =================
  const handleSearch = (value) => {
    const keyword = value.toLowerCase();

    const filtered = categories.filter((c) =>
      c.name?.toLowerCase().includes(keyword)
    );

    setFilteredCategories(filtered);
  };

  // ================= SAVE =================
  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      const method = editingCategory ? "PUT" : "POST";
      const url = editingCategory
        ? `https://voquangduong-2122110372-c-1-hsnq.onrender.com/Category/${editingCategory.id}`
        : "https://voquangduong-2122110372-c-1-hsnq.onrender.com/Category";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          description: values.description || "",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        message.error(data.message || "Lỗi lưu danh mục");
        return;
      }

      message.success(
        editingCategory ? "Cập nhật thành công" : "Thêm thành công"
      );

      setIsModalVisible(false);
      setEditingCategory(null);
      form.resetFields();
      fetchCategories();
    } catch (err) {
      console.error(err);
      message.error("Lỗi xử lý");
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    try {
      await fetch(
        `https://voquangduong-2122110372-c-1-hsnq.onrender.com/Category/${id}`,
        {
          method: "DELETE",
        }
      );

      const newList = categories.filter((c) => c.id !== id);

      setCategories(newList);
      setFilteredCategories(newList);

      message.success("Xóa thành công");
    } catch (err) {
      console.error(err);
      message.error("Xóa thất bại");
    }
  };

  // ================= ACTION =================
  const actionButtons = (_, record) => (
    <>
      <Button
        type="link"
        onClick={() => {
          setEditingCategory(record);

          form.setFieldsValue({
            name: record.name,
            description: record.description,
          });

          setIsModalVisible(true);
        }}
      >
        Sửa
      </Button>

      <Popconfirm
        title="Xóa danh mục?"
        onConfirm={() => handleDelete(record.id)}
      >
        <Button danger type="link">
          Xóa
        </Button>
      </Popconfirm>
    </>
  );

  const columns = [
    { title: "ID", dataIndex: "id" },
    { title: "Tên danh mục", dataIndex: "name" },
    { title: "Mô tả", dataIndex: "description" },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      render: (d) => (d ? new Date(d).toLocaleString() : ""),
    },
    { title: "Hành động", render: actionButtons },
  ];

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <Search
          placeholder="Tìm danh mục"
          onSearch={handleSearch}
          style={{ width: 300 }}
          allowClear
        />

        <Button
          type="primary"
          onClick={() => {
            setEditingCategory(null);
            form.resetFields();
            setIsModalVisible(true);
          }}
        >
          Thêm danh mục
        </Button>
      </div>


      <Modal
        title={editingCategory ? "Sửa danh mục" : "Thêm danh mục"}
        open={isModalVisible}
        onOk={handleSave}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên danh mục"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="description" label="Mô tả">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default Categories;