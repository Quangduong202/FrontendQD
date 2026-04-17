import { Card, Row, Col } from "antd";

function Dashboard() {
    return (
        <Row gutter={16}>
            <Col span={6}>
                <Card title="Users" bordered={false}>120</Card>
            </Col>
            <Col span={6}>
                <Card title="Products" bordered={false}>350</Card>
            </Col>
            <Col span={6}>
                <Card title="Orders" bordered={false}>87</Card>
            </Col>
            <Col span={6}>
                <Card title="Revenue" bordered={false}>$12,500</Card>
            </Col>
        </Row>
    );
}

export default Dashboard;
