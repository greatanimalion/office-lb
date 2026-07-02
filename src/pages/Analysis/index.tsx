import { Card, Statistic, Row, Col, Table, Tag } from 'antd'
import { BarChartOutlined, ArrowUpOutlined, ArrowDownOutlined, FileTextOutlined, UserOutlined, EyeOutlined } from '@ant-design/icons'

const mockData = [
  { date: '2024-01-01', documents: 120, users: 35, views: 450 },
  { date: '2024-01-02', documents: 135, users: 42, views: 520 },
  { date: '2024-01-03', documents: 118, users: 38, views: 480 },
  { date: '2024-01-04', documents: 142, users: 45, views: 560 },
  { date: '2024-01-05', documents: 150, users: 50, views: 620 },
]

const columns = [
  { title: '日期', dataIndex: 'date', key: 'date' },
  { title: '文档数量', dataIndex: 'documents', key: 'documents' },
  { title: '活跃用户', dataIndex: 'users', key: 'users' },
  { title: '浏览次数', dataIndex: 'views', key: 'views' },
]

function Analysis() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold">分析台</h2>
          <p className="text-gray-500">数据分析与统计概览</p>
        </div>
      </div>

      <Row gutter={16} className="mb-6">
        <Col span={6}>
          <Card>
            <Statistic
              title="文档总数"
              value={1250}
              prefix={<FileTextOutlined />}
              suffix={<span className="text-green-500 text-sm ml-1"><ArrowUpOutlined /> +12%</span>}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="活跃用户"
              value={235}
              prefix={<UserOutlined />}
              suffix={<span className="text-green-500 text-sm ml-1"><ArrowUpOutlined /> +8%</span>}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总浏览量"
              value={15680}
              prefix={<EyeOutlined />}
              suffix={<span className="text-red-500 text-sm ml-1"><ArrowDownOutlined /> -5%</span>}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="平均访问"
              value={66.7}
              prefix={<BarChartOutlined />}
              suffix="次/用户"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Card title="数据趋势" className="h-full">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">本周文档增长</span>
                <Tag color="green">+15%</Tag>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">本周用户增长</span>
                <Tag color="green">+12%</Tag>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">本周浏览量</span>
                <Tag color="red">-8%</Tag>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">文档平均大小</span>
                <Tag color="blue">2.3 MB</Tag>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="每日统计数据" className="h-full">
            <Table
              columns={columns}
              dataSource={mockData}
              rowKey="date"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Analysis