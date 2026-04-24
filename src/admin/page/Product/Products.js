import {
  Table,
  Button,
  Popconfirm,
  message,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
} from "antd";
import { useEffect, useState } from "react";

const { Search } = Input;

function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form] = Form.useForm();

  // ================= FETCH PRODUCTS =================
  const fetchProducts = async () => {
    try {
      const res = await fetch(
        "https://voquangduong-2122110372-c-1-hsnq.onrender.com/Product"
      );
      const data = await res.json();

      console.log("PRODUCT DATA:", data);

      // API trả array trực tiếp
      const list = Array.isArray(data) ? data : data.data;

      setProducts(list || []);
      setFilteredProducts(list || []);
    } catch (err) {
      console.error(err);
      message.error("Không load được sản phẩm");
    }
  };

  // ================= FETCH CATEGORY =================
  const fetchCategories = async () => {
    try {
      const res = await fetch(
        "https://voquangduong-2122110372-c-1-hsnq.onrender.com/Category"
      );
      const data = await res.json();

      const list = Array.isArray(data) ? data : data.data;

      setCategories(list || []);
    } catch (err) {
      console.error(err);
      message.error("Không load được danh mục");
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // ================= SEARCH =================
  const handleSearch = (value) => {
    const keyword = value.toLowerCase();
    const filtered = products.filter((p) =>
      p.name.toLowerCase().includes(keyword)
    );
    setFilteredProducts(filtered);
  };

  // ================= SAVE =================
  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      const method = editingProduct ? "PUT" : "POST";
      const url = editingProduct
        ? `https://voquangduong-2122110372-c-1-hsnq.onrender.com/Product/${editingProduct.id}`
        : "https://voquangduong-2122110372-c-1-hsnq.onrender.com/Product";

      const payload = {
        name: values.name,
        description: values.description,
        price: values.price,
        stock: values.stock,
        categoryId: values.categoryId,
      };

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        message.error(data.message || "Lỗi lưu sản phẩm");
        return;
      }

      message.success(
        editingProduct ? "Cập nhật thành công" : "Thêm sản phẩm thành công"
      );

      setIsModalVisible(false);
      setEditingProduct(null);
      form.resetFields();
      fetchProducts();
    } catch (err) {
      console.error(err);
      message.error("Lỗi xử lý");
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    try {
      await fetch(
        `https://voquangduong-2122110372-c-1-hsnq.onrender.com/Product/${id}`,
        {
          method: "DELETE",
        }
      );

      const newList = products.filter((p) => p.id !== id);
      setProducts(newList);
      setFilteredProducts(newList);

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
          setEditingProduct(record);

          form.setFieldsValue({
            name: record.name,
            price: record.price,
            stock: record.stock,
            categoryId: record.categoryId,
            description: record.description,
          });

          setIsModalVisible(true);
        }}
      >
        Edit
      </Button>

      <Popconfirm
        title="Xóa sản phẩm?"
        onConfirm={() => handleDelete(record.id)}
      >
        <Button danger type="link">
          Delete
        </Button>
      </Popconfirm>
    </>
  );

  // ================= TABLE =================
  const columns = [
    { title: "ID", dataIndex: "id" },
    { title: "Tên sản phẩm", dataIndex: "name" },
    { title: "Giá", dataIndex: "price" },
    { title: "Tồn kho", dataIndex: "stock" },

    {
      title: "Danh mục",
      dataIndex: "categoryId",
      render: (id) => {
        const c = categories.find((x) => x.id === id);
        return c ? c.name : "Không có";
      },
    },

    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      render: (date) => new Date(date).toLocaleString(),
    },

    { title: "Thao tác", render: actionButtons },
  ];

  // ================= UI =================
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
          placeholder="Search product"
          onSearch={handleSearch}
          style={{ width: 300 }}
          allowClear
        />

        <Button
          type="primary"
          onClick={() => {
            setEditingProduct(null);
            form.resetFields();
            setIsModalVisible(true);
          }}
        >
          Add Product
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={filteredProducts}
        rowKey="id"
      />

      <Modal
        title={editingProduct ? "Edit Product" : "Add Product"}
        open={isModalVisible}
        onOk={handleSave}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="price" label="Price" rules={[{ required: true }]}>
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="stock" label="Stock">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="categoryId"
            label="Category"
            rules={[{ required: true }]}
          >
            <Select placeholder="Select category">
              {categories.map((c) => (
                <Select.Option key={c.id} value={c.id}>
                  {c.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default Products;