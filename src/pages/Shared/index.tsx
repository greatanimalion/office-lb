import { Card, Table, Tag, Space, Button, Input } from 'antd'
import { ShareAltOutlined, EyeOutlined, EditOutlined, DeleteOutlined, UserOutlined, CalendarOutlined } from '@ant-design/icons'

const { Search } = Input

const mockData = [
  {
    id: 1,
    title: '项目计划书.docx',
    sharedBy: '张三',
    sharedAt: '2024-01-15 10:30',
    permission: '编辑',
    status: '已接受',
  },
  {
    id: 2,
    title: '会议纪要.pdf',
    sharedBy: '李四',
    sharedAt: '2024-01-14 15:20',
    permission: '查看',
    status: '已接受',
  },
  {
    id: 3,
    title: '财务报表.xlsx',
    sharedBy: '王五',
    sharedAt: '2024-01-13 09:15',
    permission: '编辑',
    status: '待接受',
  },
  {
    id: 4,
    title: '产品需求文档.docx',
    sharedBy: '赵六',
    sharedAt: '2024-01-12 14:45',
    permission: '查看',
    status: '已接受',
  },
]

const columns = [
  {
    title: '文件名',
    dataIndex: 'title',
    key: 'title',
    ellipsis: true,
    render: (text: string) => (
      <div className="flex items-center gap-2">
        <ShareAltOutlined className="text-blue-500" />
        <span>{text}</span>
      </div>
    ),
  },
  {
    title: '共享者',
    dataIndex: 'sharedBy',
    key: 'sharedBy',
    render: (text: string) => (
      <div className="flex items-center gap-2">
        <UserOutlined className="text-gray-400" />
        <span>{text}</span>
      </div>
    ),
  },
  {
    title: '共享时间',
    dataIndex: 'sharedAt',
    key: 'sharedAt',
    render: (text: string) => (
      <div className="flex items-center gap-2">
        <CalendarOutlined className="text-gray-400" />
        <span>{text}</span>
      </div>
    ),
  },
  {
    title: '权限',
    dataIndex: 'permission',
    key: 'permission',
    render: (text: string) => (
      <Tag color={text === '编辑' ? 'green' : 'blue'}>{text}</Tag>
    ),
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: (text: string) => (
      <Tag color={text === '已接受' ? 'green' : 'orange'}>{text}</Tag>
    ),
  },
  {
    title: '操作',
    key: 'action',
    render: () => (
      <Space size="middle">
        <Button type="text" icon={<EyeOutlined />}>查看</Button>
        <Button type="text" icon={<EditOutlined />}>编辑</Button>
        <Button type="text" danger icon={<DeleteOutlined />}>取消共享</Button>
      </Space>
    ),
  },
]

function Shared() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold">共享文档</h2>
          <p className="text-gray-500">查看和管理他人共享给您的文档</p>
        </div>
        <Search
          placeholder="搜索共享文档..."
          allowClear
          enterButton
          size="middle"
          style={{ width: 300 }}
        />
      </div>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-4">
            <Tag color="green">已接受 (3)</Tag>
            <Tag color="orange">待接受 (1)</Tag>
          </div>
        </div>
        <Table
          columns={columns}
          dataSource={mockData}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>
    </div>
  )
}

export default Shared