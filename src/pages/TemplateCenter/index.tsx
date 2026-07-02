import { Card, Row, Col, Tag, Button, Input, Space } from 'antd'
import { FileTextOutlined, FileExcelOutlined, FilePdfOutlined, FileImageOutlined, DownloadOutlined } from '@ant-design/icons'

const { Search } = Input

const mockTemplates = [
  {
    id: 1,
    name: '项目计划书',
    description: '标准项目计划书模板，包含项目概述、时间线、资源分配等',
    icon: <FileTextOutlined className="text-blue-500" />,
    category: '文档',
    format: 'docx',
    size: '256 KB',
    downloads: 1256,
  },
  {
    id: 2,
    name: '财务报表',
    description: '专业财务报表模板，包含收支明细、资产负债表等',
    icon: <FileExcelOutlined className="text-green-500" />,
    category: '表格',
    format: 'xlsx',
    size: '128 KB',
    downloads: 980,
  },
  {
    id: 3,
    name: '演示文稿',
    description: '精美演示文稿模板，适用于产品展示和汇报',
    icon: <FileImageOutlined className="text-orange-500" />,
    category: '演示',
    format: 'pptx',
    size: '512 KB',
    downloads: 1560,
  },
  {
    id: 4,
    name: '合同模板',
    description: '标准合同模板，包含条款和条件',
    icon: <FileTextOutlined className="text-blue-500" />,
    category: '文档',
    format: 'docx',
    size: '256 KB',
    downloads: 780,
  },
  {
    id: 5,
    name: '数据分析报告',
    description: '专业数据分析报告模板，包含图表和数据可视化',
    icon: <FilePdfOutlined className="text-red-500" />,
    category: '报告',
    format: 'pdf',
    size: '384 KB',
    downloads: 650,
  },
  {
    id: 6,
    name: '会议纪要',
    description: '标准会议纪要模板，记录会议内容和决议',
    icon: <FileTextOutlined className="text-blue-500" />,
    category: '文档',
    format: 'docx',
    size: '128 KB',
    downloads: 1120,
  },
]

function TemplateCenter() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold">模板中心</h2>
          <p className="text-gray-500">浏览和使用文档模板</p>
        </div>
        <Space>
          <Search
            placeholder="搜索模板..."
            allowClear
            enterButton
            size="middle"
            style={{ width: 300 }}
          />
          <Button type="primary">上传模板</Button>
        </Space>
      </div>

      <div className="flex gap-4 mb-6">
        <Tag color="blue">全部</Tag>
        <Tag>文档</Tag>
        <Tag>表格</Tag>
        <Tag>演示</Tag>
        <Tag>报告</Tag>
      </div>

      <Row gutter={[16, 16]}>
        {mockTemplates.map((template) => (
          <Col span={8} key={template.id}>
            <Card
              hoverable
              className="h-full"
              bodyStyle={{ padding: '20px' }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14   rounded-lg flex items-center justify-center">
                  {template.icon}
                </div>
                <div>
                  <h3 className="font-medium">{template.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Tag color="blue">{template.category}</Tag>
                    <Tag>{template.format.toUpperCase()}</Tag>
                  </div>
                </div>
              </div>
              <p className="text-gray-500 text-sm mb-4">{template.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500">{template.size}</span>
                  <span className="text-sm text-gray-500">{template.downloads} 下载</span>
                </div>
                <Button size="small" icon={<DownloadOutlined />}>
                  使用
                </Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default TemplateCenter