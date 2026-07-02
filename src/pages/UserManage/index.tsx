import { useState, useEffect } from 'react'
import { Card, Table, Tag, Button, Input, Space, Modal, Form, Select, Avatar, Popconfirm, message, Row, Col } from 'antd'
import { TeamOutlined, UserOutlined, MailOutlined, PlusOutlined, EditOutlined, DeleteOutlined, LockOutlined, UnlockOutlined, SearchOutlined } from '@ant-design/icons'
import { authAPI } from '@/services/api/auth'

const { Search } = Input

interface UserItem {
  id: number
  username: string
  email: string
  avatar?: string
  role?: string
  provider: string
  last_login_at: string
  status?: string
}

const mockUsers: UserItem[] = [
  { id: 1, username: '张三', email: 'zhangsan@example.com', avatar: '', role: 'admin', provider: 'local', last_login_at: '2024-01-15 10:30', status: 'active' },
  { id: 2, username: '李四', email: 'lisi@example.com', avatar: '', role: 'user', provider: 'local', last_login_at: '2024-01-14 15:20', status: 'active' },
  { id: 3, username: '王五', email: 'wangwu@example.com', avatar: '', role: 'user', provider: 'gitlab', last_login_at: '2024-01-13 09:15', status: 'active' },
  { id: 4, username: '赵六', email: 'zhaoliu@example.com', avatar: '', role: 'admin', provider: 'dingtalk', last_login_at: '2024-01-12 14:45', status: 'inactive' },
  { id: 5, username: '孙七', email: 'sunqi@example.com', avatar: '', role: 'user', provider: 'weixin', last_login_at: '2024-01-11 11:30', status: 'active' },
]

const columns = [
  {
    title: '用户',
    dataIndex: 'username',
    key: 'username',
    render: (text: string, record: UserItem) => (
      <div className="flex items-center gap-3">
        <Avatar icon={<UserOutlined />} className="bg-blue-500" />
        <div>
          <div className="font-medium">{text}</div>
          <div className="text-sm text-gray-500">{record.email}</div>
        </div>
      </div>
    ),
  },
  {
    title: '角色',
    dataIndex: 'role',
    key: 'role',
    render: (text: string) => (
      <Tag color={text === 'admin' ? 'red' : 'blue'}>
        {text === 'admin' ? '管理员' : '普通用户'}
      </Tag>
    ),
  },
  {
    title: '登录方式',
    dataIndex: 'provider',
    key: 'provider',
    render: (text: string) => {
      const providers: Record<string, string> = {
        local: '本地登录',
        gitlab: 'GitLab',
        dingtalk: '钉钉',
        weixin: '微信',
      }
      return providers[text] || text
    },
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: (text: string) => (
      <Tag color={text === 'active' ? 'green' : 'red'}>
        {text === 'active' ? '活跃' : '禁用'}
      </Tag>
    ),
  },
  {
    title: '最后登录',
    dataIndex: 'last_login_at',
    key: 'last_login_at',
  },
  {
    title: '操作',
    key: 'action',
    render: (_: unknown, record: UserItem) => (
      <Space>
        <Button type="text" icon={<EditOutlined />}>编辑</Button>
        <Button type="text" icon={record.status === 'active' ? <LockOutlined /> : <UnlockOutlined />}>
          {record.status === 'active' ? '禁用' : '启用'}
        </Button>
        <Popconfirm
          title={`确定删除用户 "${record.username}" 吗？`}
          onConfirm={() => message.info('删除功能待实现')}
          okText="确定"
          cancelText="取消"
        >
          <Button type="text" danger icon={<DeleteOutlined />}>删除</Button>
        </Popconfirm>
      </Space>
    ),
  },
]

function UserManage() {
  const [form] = Form.useForm()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [users, setUsers] = useState<UserItem[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await authAPI.getAllUser()
      if (res.data.success) {
        setUsers(res.data.user as UserItem[])
      } else {
        setUsers(mockUsers)
      }
    } catch {
      setUsers(mockUsers)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold">用户管理</h2>
          <p className="text-gray-500">管理系统用户和权限</p>
        </div>
      </div>

      <Row gutter={16} className="mb-6">
        <Col span={6}>
          <Card>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <TeamOutlined className="text-blue-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">{users.length}</div>
                <div className="text-sm text-gray-500">总用户数</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <UserOutlined className="text-green-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">{users.filter(u => u.status === 'active').length}</div>
                <div className="text-sm text-gray-500">活跃用户</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                <LockOutlined className="text-red-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">{users.filter(u => u.status === 'inactive').length}</div>
                <div className="text-sm text-gray-500">禁用用户</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                <MailOutlined className="text-purple-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">{users.filter(u => u.role === 'admin').length}</div>
                <div className="text-sm text-gray-500">管理员</div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-4">
            <Search
              placeholder="搜索用户..."
              allowClear
              enterButton={<SearchOutlined />}
              size="middle"
              style={{ width: 300 }}
            />
            <Select
              placeholder="按角色筛选"
              options={[
                { value: 'all', label: '全部角色' },
                { value: 'admin', label: '管理员' },
                { value: 'user', label: '普通用户' },
              ]}
              size="middle"
              style={{ width: 150 }}
            />
            <Select
              placeholder="按状态筛选"
              options={[
                { value: 'all', label: '全部状态' },
                { value: 'active', label: '活跃' },
                { value: 'inactive', label: '禁用' },
              ]}
              size="middle"
              style={{ width: 150 }}
            />
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenModal}>
            添加用户
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={users}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>

      <Modal
        title="添加用户"
        open={isModalOpen}
        onOk={() => {
          form.validateFields().then(() => {
            message.success('用户添加成功')
            setIsModalOpen(false)
            form.resetFields()
          })
        }}
        onCancel={() => {
          setIsModalOpen(false)
          form.resetFields()
        }}
        okText="确认添加"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' },
            ]}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>
          <Form.Item
            name="password"
            label="密码"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password placeholder="请输入密码" />
          </Form.Item>
          <Form.Item
            name="role"
            label="角色"
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Select
              options={[
                { value: 'admin', label: '管理员' },
                { value: 'user', label: '普通用户' },
              ]}
              placeholder="请选择角色"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default UserManage