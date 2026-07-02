import { Card, Tag, List } from 'antd'
import { FileTextOutlined, BugOutlined, PlusOutlined, EditOutlined, ArrowUpOutlined } from '@ant-design/icons'

const mockUpdates = [
  {
    version: 'v1.0.0',
    date: '2024-01-15',
    type: 'major',
    changes: [
      { icon: <PlusOutlined className="text-green-500" />, text: '新增文档管理功能' },
      { icon: <PlusOutlined className="text-green-500" />, text: '新增组管理功能' },
      { icon: <PlusOutlined className="text-green-500" />, text: '新增权限管理功能' },
      { icon: <EditOutlined className="text-blue-500" />, text: '优化用户界面' },
      { icon: <BugOutlined className="text-red-500" />, text: '修复已知问题' },
    ],
  },
  {
    version: 'v0.9.0',
    date: '2024-01-10',
    type: 'minor',
    changes: [
      { icon: <PlusOutlined className="text-green-500" />, text: '新增文档预览功能' },
      { icon: <PlusOutlined className="text-green-500" />, text: '新增文档共享功能' },
      { icon: <EditOutlined className="text-blue-500" />, text: '优化文档上传体验' },
      { icon: <ArrowUpOutlined className="text-orange-500" />, text: '提升系统性能' },
    ],
  },
  {
    version: 'v0.8.0',
    date: '2024-01-05',
    type: 'minor',
    changes: [
      { icon: <PlusOutlined className="text-green-500" />, text: '新增用户管理功能' },
      { icon: <PlusOutlined className="text-green-500" />, text: '新增审计日志功能' },
      { icon: <EditOutlined className="text-blue-500" />, text: '优化登录页面' },
      { icon: <BugOutlined className="text-red-500" />, text: '修复登录验证码问题' },
    ],
  },
  {
    version: 'v0.7.0',
    date: '2023-12-28',
    type: 'patch',
    changes: [
      { icon: <EditOutlined className="text-blue-500" />, text: '优化响应式布局' },
      { icon: <BugOutlined className="text-red-500" />, text: '修复移动端适配问题' },
      { icon: <ArrowUpOutlined className="text-orange-500" />, text: '提升页面加载速度' },
    ],
  },
]

function UpdateLog() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold">更新日志</h2>
          <p className="text-gray-500">查看系统更新记录</p>
        </div>
      </div>

      <Card className="mb-6">
        <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
          <FileTextOutlined className="text-blue-500 text-xl" />
          <div>
            <h3 className="font-medium">最新版本</h3>
            <p className="text-gray-500">v1.0.0 - 2024-01-15</p>
          </div>
          <Tag color="green" className="ml-auto">最新版本</Tag>
        </div>
      </Card>

      <List
        dataSource={mockUpdates}
        renderItem={(update) => (
          <Card className="mb-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Tag color={update.type === 'major' ? 'red' : update.type === 'minor' ? 'blue' : 'gray'}>
                  {update.type === 'major' ? '重大更新' : update.type === 'minor' ? '功能更新' : '补丁更新'}
                </Tag>
                <span className="font-bold text-lg">{update.version}</span>
              </div>
              <span className="text-gray-500 ml-auto">{update.date}</span>
            </div>
            <ul className="space-y-2">
              {update.changes.map((change, index) => (
                <li key={index} className="flex items-center gap-2">
                  {change.icon}
                  <span>{change.text}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}
      />
    </div>
  )
}

export default UpdateLog