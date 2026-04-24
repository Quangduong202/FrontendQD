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

// 🔥 ĐỔI API nếu bạn deploy mới
const API = "https://voquangduong-2122110372-c-1-hsnq.onrender.com";

function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form] = Form.useForm();

  // ================= FETCH =================
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API}/Product`);
      const data = await res.json();
      setProducts(data || []);
      setFilteredProducts(data || []);
    } catch (err) {
      console.error(err);
      message.error("Không load được sản phẩm");
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API}/Category`);
      const data = await res.json();
      setCategories(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBrands = async () => {
    try {
      const res = await fetch(`${API}/Brand`);
      const data = await res.json();
      setBrands(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchBrands();
  }, []);

  // ================= SEARCH =================
  const handleSearch = (value) => {
    const keyword = value.toLowerCase();
    const filtered = products.filter((p) =>
      p.name?.toLowerCase().includes(keyword)
    );
    setFilteredProducts(filtered);
  };

  // ================= SAVE =================
  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      const method = editingProduct ? "PUT" : "POST";
      const url = editingProduct
        ? `${API}/Product/${editingProduct.id}`
        : `${API}/Product`;

      const payload = {
        name: values.name,
        image: values.image,
        price: values.price,
        oldPrice: values.oldPrice || 0,
        description: values.description || "",
        specification: values.specification || "",
        buyTurn: "0",
        quantity: values.stock || 0,
        categoryId: values.categoryId,
        brandId: values.brandId,
      };

      console.log("PAYLOAD:", payload);
      console.log("URL:", url);

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("RESPONSE:", data);

      if (!res.ok) {
        const errorMsg =
          data?.title ||
          Object.values(data?.errors || {}).flat().join(", ") ||
          "Lỗi lưu sản phẩm";

        message.error(errorMsg);
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
      await fetch(`${API}/Product/${id}`, {
        method: "DELETE",
      });

      fetchProducts();
      message.success("Xóa thành công");
    } catch (err) {
      console.error(err);
      message.error("Xóa thất bại");
    }
  };

  // ================= TABLE =================
  const columns = [
    { title: "ID", dataIndex: "id" },
    { title: "Tên", dataIndex: "name" },

    {
      title: "Ảnh",
      dataIndex: "image",
      render: (img) =>
        img ? (
          <img src={img} alt="product" style={{ width: 50 }} />
        ) : (
          "N/A"
        ),
    },

    { title: "Giá", dataIndex: "price" },
    { title: "Kho", dataIndex: "quantity" },

    {
      title: "Danh mục",
      render: (_, r) =>
        categories.find((c) => c.id === r.categoryId)?.name || "N/A",
    },

    {
      title: "Brand",
      render: (_, r) =>
        brands.find((b) => b.id === r.brandId)?.name || "N/A",
    },

    {
      title: "Thao tác",
      render: (_, record) => (
        <>
          <Button
            type="link"
            onClick={() => {
              setEditingProduct(record);

              form.setFieldsValue({
                name: record.name,
                image: record.image,
                price: record.price,
                stock: record.quantity,
                categoryId: record.categoryId,
                brandId: record.brandId,
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
      ),
    },
  ];

  // ================= UI =================
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <Search
          placeholder="Search"
          onSearch={handleSearch}
          style={{ width: 300 }}
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

      <Table columns={columns} dataSource={filteredProducts} rowKey="id" />

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

          {/* 🔥 IMAGE */}
          <Form.Item
            name="image"
            label="Image URL"
            rules={[{ required: true, message: "Nhập link ảnh" }]}
          >
            <Input placeholder="https://..." />
          </Form.Item>

          <Form.Item name="price" label="Price" rules={[{ required: true }]}>
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="stock" label="Stock">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="categoryId" label="Category" rules={[{ required: true }]}>
            <Select>
              {categories.map((c) => (
                <Select.Option key={c.id} value={c.id}>
                  {c.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="brandId" label="Brand" rules={[{ required: true }]}>
            <Select>
              {brands.map((b) => (
                <Select.Option key={b.id} value={b.id}>
                  {b.username}
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