import { Card, Row, Col, Tag, Button, Input } from 'antd'
import { AppstoreOutlined, DownloadOutlined, StarOutlined, SettingOutlined, LayoutOutlined, FormOutlined, TableOutlined, BarChartOutlined } from '@ant-design/icons'

const { Search } = Input

const mockComponents = [
  {
    id: 1,
    name: '数据表格',
    description: '高级数据表格组件，支持排序、筛选、分页',
    icon: <TableOutlined className="text-blue-500" />,
    category: '数据展示',
    version: '1.0.0',
    stars: 4.8,
    downloads: 1256,
  },
  {
    id: 2,
    name: '表单组件',
    description: '表单组件，支持多种表单验证和布局',
    icon: <FormOutlined className="text-green-500" />,
    category: '表单',
    version: '1.0.0',
    stars: 4.6,
    downloads: 980,
  },
  {
    id: 3,
    name: '图表组件',
    description: '丰富的图表组件，支持折线图、柱状图、饼图等',
    icon: <BarChartOutlined className="text-orange-500" />,
    category: '数据展示',
    version: '1.0.0',
    stars: 4.9,
    downloads: 1560,
  },
  {
    id: 4,
    name: '布局组件',
    description: '响应式布局组件，支持多种布局方式',
    icon: <LayoutOutlined className="text-purple-500" />,
    category: '布局',
    version: '1.0.0',
    stars: 4.5,
    downloads: 780,
  },
  {
    id: 5,
    name: '设置面板',
    description: '配置设置面板组件，支持分组和验证',
    icon: <SettingOutlined className="text-gray-500" />,
    category: '表单',
    version: '1.0.0',
    stars: 4.7,
    downloads: 650,
  },
  {
    id: 6,
    name: '卡片组件',
    description: '精美卡片组件，支持多种样式和交互',
    icon: <AppstoreOutlined className="text-red-500" />,
    category: '展示',
    version: '1.0.0',
    stars: 4.8,
    downloads: 1120,
  },
]

function ComponentCenter() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold">组件中心</h2>
          <p className="text-gray-500">浏览和管理可用的UI组件</p>
        </div>
        <Search
          placeholder="搜索组件..."
          allowClear
          enterButton
          size="middle"
          style={{ width: 300 }}
        />
      </div>

      <div className="flex gap-4 mb-6">
        <Tag color="blue">全部</Tag>
        <Tag>数据展示</Tag>
        <Tag>表单</Tag>
        <Tag>布局</Tag>
        <Tag>展示</Tag>
      </div>

      <Row gutter={[16, 16]}>
        {mockComponents.map((component) => (
          <Col span={8} key={component.id}>
            <Card
              hoverable
              className="h-full"
              bodyStyle={{ padding: '20px' }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center">
                  {component.icon}
                </div>
                <div>
                  <h3 className="font-medium">{component.name}</h3>
                  <Tag color="blue">{component.category}</Tag>
                </div>
              </div>
              <p className="text-gray-500 text-sm mb-4">{component.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <StarOutlined className="text-yellow-500" />
                    <span className="text-sm">{component.stars}</span>
                  </div>
                  <span className="text-sm text-gray-500">{component.downloads} 下载</span>
                </div>
                <Button size="small" icon={<DownloadOutlined />}>
                  下载
                </Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default ComponentCenter