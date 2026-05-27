import { Card, Statistic, Row, Col } from 'antd'
import { FileTextOutlined, TeamOutlined, ShareAltOutlined, EyeOutlined } from '@ant-design/icons'

function Dashboard() {
  return (
    <div>
      <h2 className="text-xl font-bold mb-6">仪表盘</h2>
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic title="文档总数" value={0} prefix={<FileTextOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="共享文档" value={0} prefix={<ShareAltOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="在线用户" value={0} prefix={<TeamOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="今日浏览" value={0} prefix={<EyeOutlined />} />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard