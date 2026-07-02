import { useState, useEffect } from 'react'
import { Card, Table, Tag, Button, Input, Modal, Select, Row, Col } from 'antd'
import { AuditOutlined, FileTextOutlined, UserOutlined, EyeOutlined, SearchOutlined, ClockCircleOutlined, EditOutlined, DeleteOutlined, UploadOutlined, ShareAltOutlined, PlusOutlined } from '@ant-design/icons'
import { auditAPI } from '@/services/api/audit'
import type { AuditLog } from '@/types'

const { Search } = Input

const mockLogs: AuditLog[] = [
  { id: 1, userId: 1, username: '张三', action: 'create', targetType: 'document', targetId: 101, targetName: '项目计划书.docx', detail: '创建了新文档', ip: '192.168.1.100', createdAt: '2024-01-15 10:30:00' },
  { id: 2, userId: 1, username: '张三', action: 'edit', targetType: 'document', targetId: 101, targetName: '项目计划书.docx', detail: '编辑了文档内容', ip: '192.168.1.100', createdAt: '2024-01-15 10:35:00' },
  { id: 3, userId: 2, username: '李四', action: 'share', targetType: 'document', targetId: 102, targetName: '会议纪要.pdf', detail: '将文档共享给王五', ip: '192.168.1.101', createdAt: '2024-01-15 11:20:00' },
  { id: 4, userId: 3, username: '王五', action: 'view', targetType: 'document', targetId: 102, targetName: '会议纪要.pdf', detail: '查看了文档', ip: '192.168.1.102', createdAt: '2024-01-15 11:25:00' },
  { id: 5, userId: 4, username: '赵六', action: 'delete', targetType: 'document', targetId: 103, targetName: '旧版需求.docx', detail: '删除了文档', ip: '192.168.1.103', createdAt: '2024-01-15 14:10:00' },
  { id: 6, userId: 1, username: '张三', action: 'upload', targetType: 'document', targetId: 104, targetName: '财务报表.xlsx', detail: '上传了新文档', ip: '192.168.1.100', createdAt: '2024-01-15 15:00:00' },
]

const actionIcons: Record<string, React.ReactNode> = {
  create: <PlusOutlined className="text-green-500" />,
  edit: <EditOutlined className="text-blue-500" />,
  delete: <DeleteOutlined className="text-red-500" />,
  view: <EyeOutlined className="text-gray-500" />,
  share: <ShareAltOutlined className="text-orange-500" />,
  upload: <UploadOutlined className="text-purple-500" />,
}

const actionLabels: Record<string, string> = {
  create: '创建',
  edit: '编辑',
  delete: '删除',
  view: '查看',
  share: '共享',
  upload: '上传',
}

const targetTypeLabels: Record<string, string> = {
  document: '文档',
  folder: '文件夹',
  group: '组',
  user: '用户',
}

const columns = [
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    width: 100,
    render: (text: string) => (
      <div className="flex items-center gap-2">
        {actionIcons[text] || <FileTextOutlined />}
        <span>{actionLabels[text] || text}</span>
      </div>
    ),
  },
  {
    title: '目标类型',
    dataIndex: 'targetType',
    key: 'targetType',
    width: 100,
    render: (text: string) => (
      <Tag color="blue">{targetTypeLabels[text] || text}</Tag>
    ),
  },
  {
    title: '目标名称',
    dataIndex: 'targetName',
    key: 'targetName',
    render: (text: string) => (
      <div className="flex items-center gap-2">
        <FileTextOutlined className="text-gray-400" />
        <span>{text}</span>
      </div>
    ),
  },
  {
    title: '操作用户',
    dataIndex: 'username',
    key: 'username',
    width: 120,
    render: (text: string) => (
      <div className="flex items-center gap-2">
        <UserOutlined className="text-gray-400" />
        <span>{text}</span>
      </div>
    ),
  },
  {
    title: '操作详情',
    dataIndex: 'detail',
    key: 'detail',
  },
  {
    title: 'IP地址',
    dataIndex: 'ip',
    key: 'ip',
    width: 150,
  },
  {
    title: '操作时间',
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: 180,
    render: (text: string) => (
      <div className="flex items-center gap-2">
        <ClockCircleOutlined className="text-gray-400" />
        <span>{text}</span>
      </div>
    ),
  },
]

function AuditLogPage() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    fetchLogs()
  }, [])

  const fetchLogs = async () => {
    setLoading(true)
    try {
      const res = await auditAPI.list({ page: 1, pageSize: 20 })
      if (res.data) {
        setLogs(res.data.list)
      } else {
        setLogs(mockLogs)
      }
    } catch {
      setLogs(mockLogs)
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetail = (log: AuditLog) => {
    setSelectedLog(log)
    setIsModalOpen(true)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold">操作审计日志</h2>
          <p className="text-gray-500">记录系统所有操作行为</p>
        </div>
      </div>

      <Row gutter={16} className="mb-6">
        <Col span={6}>
          <Card>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <AuditOutlined className="text-blue-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">{logs.length}</div>
                <div className="text-sm text-gray-500">总日志数</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <EditOutlined className="text-green-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">{logs.filter(l => l.action === 'create').length}</div>
                <div className="text-sm text-gray-500">创建操作</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                <ShareAltOutlined className="text-orange-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">{logs.filter(l => l.action === 'share').length}</div>
                <div className="text-sm text-gray-500">共享操作</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                <DeleteOutlined className="text-red-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">{logs.filter(l => l.action === 'delete').length}</div>
                <div className="text-sm text-gray-500">删除操作</div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-4">
            <Search
              placeholder="搜索日志..."
              allowClear
              enterButton={<SearchOutlined />}
              size="middle"
              style={{ width: 300 }}
            />
            <Select
              placeholder="按操作类型筛选"
              options={[
                { value: 'all', label: '全部操作' },
                { value: 'create', label: '创建' },
                { value: 'edit', label: '编辑' },
                { value: 'delete', label: '删除' },
                { value: 'view', label: '查看' },
                { value: 'share', label: '共享' },
                { value: 'upload', label: '上传' },
              ]}
              size="middle"
              style={{ width: 150 }}
            />
            <Select
              placeholder="按目标类型筛选"
              options={[
                { value: 'all', label: '全部类型' },
                { value: 'document', label: '文档' },
                { value: 'folder', label: '文件夹' },
                { value: 'group', label: '组' },
                { value: 'user', label: '用户' },
              ]}
              size="middle"
              style={{ width: 150 }}
            />
          </div>
          <Button type="primary" icon={<SearchOutlined />}>
            高级搜索
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={logs}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
          onRow={(record) => ({
            onClick: () => handleViewDetail(record),
          })}
        />
      </Card>

      <Modal
        title="日志详情"
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false)
          setSelectedLog(null)
        }}
        footer={null}
      >
        {selectedLog && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center">
                {actionIcons[selectedLog.action] || <AuditOutlined className="text-blue-500" />}
              </div>
              <div>
                <div className="text-xl font-bold">{actionLabels[selectedLog.action] || selectedLog.action}</div>
                <div className="text-sm text-gray-500">{targetTypeLabels[selectedLog.targetType] || selectedLog.targetType}</div>
              </div>
            </div>
            <div className="border-t pt-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">目标名称</span>
                <span className="font-medium">{selectedLog.targetName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">操作用户</span>
                <span className="font-medium">{selectedLog.username}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">操作详情</span>
                <span className="font-medium">{selectedLog.detail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">IP地址</span>
                <span className="font-medium">{selectedLog.ip}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">操作时间</span>
                <span className="font-medium">{selectedLog.createdAt}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">目标ID</span>
                <span className="font-medium">{selectedLog.targetId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">用户ID</span>
                <span className="font-medium">{selectedLog.userId}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default AuditLogPage