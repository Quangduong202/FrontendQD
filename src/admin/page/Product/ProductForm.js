import { Form, Input, InputNumber, Button, Select, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useEffect } from "react";

const { TextArea } = Input;

function ProductForm({ initialValues, onSubmit, loading }) {
    const [form] = Form.useForm();

    useEffect(() => {
        if (initialValues) {
            form.setFieldsValue(initialValues);
        }
    }, [initialValues, form]);

    const handleFinish = (values) => {
        onSubmit(values);
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
        >
            <Form.Item
                label="Product Name"
                name="name"
                rules={[{ required: true, message: "Please enter product name" }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Price"
                name="price"
                rules={[{ required: true }]}
            >
                <InputNumber style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
                label="Description"
                name="description"
            >
                <TextArea rows={4} />
            </Form.Item>

            <Form.Item
                label="Image"
                name="image"
                valuePropName="file"
            >
                <Upload beforeUpload={() => false} maxCount={1}>
                    <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
            </Form.Item>

            <Button type="primary" htmlType="submit" loading={loading}>
                Save
            </Button>
        </Form>
    );
}

export default ProductForm;
