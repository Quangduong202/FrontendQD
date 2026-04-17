import { useEffect, useState } from "react";
import { Table, Button, Upload, Popconfirm, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

function Images() {
  const [images, setImages] = useState([]);
  const [fileList, setFileList] = useState([]);

  // Lấy danh sách ảnh từ backend
  const fetchImages = () => {
    fetch("http://localhost:3000/api/images")
      .then(res => res.json())
      .then(data => setImages(data.images));
  };

  useEffect(() => {
    fetchImages();
  }, []);

  // Upload ảnh mới
  const handleUpload = async ({ file, onSuccess, onError }) => {
    try {
      const formData = new FormData();
      formData.append("images", file);

      const res = await fetch("http://localhost:3000/api/images/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        message.success("Upload thành công");
        onSuccess(data, file);
        fetchImages();
      } else {
        onError(new Error(data.message || "Upload failed"));
        message.error(data.message || "Upload failed");
      }
    } catch (err) {
      onError(err);
      message.error("Có lỗi khi upload ảnh");
    }
  };

  // Xóa ảnh
  const handleDelete = async (url) => {
    const filename = url.split("/").pop();
    const res = await fetch(`http://localhost:3000/api/images/${filename}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    const data = await res.json();
    if (res.ok) {
      message.success("Xóa ảnh thành công");
      fetchImages();
    } else {
      message.error(data.message || "Xóa ảnh thất bại");
    }
  };

  const columns = [
    {
      title: "Preview",
      dataIndex: "url",
      render: (url) => (
        <img src={`http://localhost:3000${url}`} alt="uploaded" width={100} />
      ),
    },
    {
      title: "Filename",
      dataIndex: "url",
      render: (url) => url.split("/").pop(),
    },
    {
      title: "Action",
      dataIndex: "url",
      render: (url) => (
        <Popconfirm
          title="Xóa ảnh này?"
          onConfirm={() => handleDelete(url)}
        >
          <Button danger type="link">Delete</Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <>
      <Upload
        multiple
        fileList={fileList}
        onChange={({ fileList }) => setFileList(fileList)}
        customRequest={handleUpload}
        showUploadList={false}
      >
        <Button icon={<UploadOutlined />}>Upload Images</Button>
      </Upload>

      <Table
        columns={columns}
        dataSource={images.map((url, idx) => ({ key: idx, url }))}
        rowKey="key"
        style={{ marginTop: 20 }}
      />
    </>
  );
}

export default Images;
