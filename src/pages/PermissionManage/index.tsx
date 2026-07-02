import { useState } from 'react'
import { Card, Tabs, Table, Tag, Button, Input, Space, Modal, Form, Select, Row, Col } from 'antd'
import { SafetyOutlined, UserOutlined, FileTextOutlined, SettingOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'

const { Search } = Input

const mockRoles = [
  { role: 'owner', name: '所有者', permissions: ['view', 'download', 'edit', 'delete', 'comment', 'change_permission', 'share', 'make_template', 'upload_file'] },
  { role: 'admin', name: '管理员', permissions: ['view', 'download', 'edit', 'delete', 'comment', 'share', 'upload_file'] },
  { role: 'member', name: '成员', permissions: ['view', 'download', 'edit', 'comment'] },
  { role: 'viewer', name: '查看者', permissions: ['view', 'download'] },
]

const mockPermissionRules = [
  { id: 1, userId: 1, username: '张三', documentId: 101, documentName: '项目计划书.docx', permissions: ['view', 'edit', 'download'], expiresAt: '2024-02-15' },
  { id: 2, userId: 2, username: '李四', documentId: 101, documentName: '项目计划书.docx', permissions: ['view'], expiresAt: null },
  { id: 3, userId: 3, username: '王五', documentId: 102, documentName: '财务报表.xlsx', permissions: ['view', 'edit', 'download', 'comment'], expiresAt: '2024-01-30' },
]

const permissionOptions = [
  { value: 'view', label: '查看' },
  { value: 'download', label: '下载' },
  { value: 'edit', label: '编辑' },
  { value: 'delete', label: '删除' },
  { value: 'comment', label: '评论' },
  { value: 'share', label: '共享' },
  { value: 'change_permission', label: '修改权限' },
  { value: 'make_template', label: '设为模板' },
  { value: 'upload_file', label: '上传文件' },
]

const roleColumns = [
  { title: '角色', dataIndex: 'role', key: 'role', render: (text: string) => <Tag color="blue">{text}</Tag> },
  { title: '角色名称', dataIndex: 'name', key: 'name' },
  { title: '权限数量', dataIndex: 'permissions', key: 'count', render: (permissions: string[]) => permissions.length },
  { title: '权限列表', dataIndex: 'permissions', key: 'permissions', render: (permissions: string[]) => (
    <div className="flex flex-wrap gap-1">
      {permissions.map((p, i) => (
        <Tag key={i}>{p}</Tag>
      ))}
    </div>
  )},
  { title: '操作', key: 'action', render: () => (
    <Space>
      <Button type="text" icon={<EditOutlined />}>编辑</Button>
      <Button type="text" danger icon={<DeleteOutlined />}>删除</Button>
    </Space>
  )},
]

const ruleColumns = [
  { title: '用户', dataIndex: 'username', key: 'username', render: (text: string) => (
    <div className="flex items-center gap-2">
      <UserOutlined />
      <span>{text}</span>
    </div>
  )},
  { title: '文档', dataIndex: 'documentName', key: 'documentName', render: (text: string) => (
    <div className="flex items-center gap-2">
      <FileTextOutlined />
      <span>{text}</span>
    </div>
  )},
  { title: '权限', dataIndex: 'permissions', key: 'permissions', render: (permissions: string[]) => (
    <div className="flex flex-wrap gap-1">
      {permissions.map((p, i) => (
        <Tag key={i} color="green">{p}</Tag>
      ))}
    </div>
  )},
  { title: '过期时间', dataIndex: 'expiresAt', key: 'expiresAt', render: (text: string | null) => (
    text || <span className="text-gray-400">永久</span>
  )},
  { title: '操作', key: 'action', render: () => (
    <Space>
      <Button type="text" icon={<EditOutlined />}>编辑</Button>
      <Button type="text" danger icon={<DeleteOutlined />}>删除</Button>
    </Space>
  )},
]

function PermissionManage() {
  const [form] = Form.useForm()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold">权限管理</h2>
          <p className="text-gray-500">管理系统角色和权限规则</p>
        </div>
      </div>

      <Row gutter={16} className="mb-6">
        <Col span={6}>
          <Card>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <SafetyOutlined className="text-blue-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">4</div>
                <div className="text-sm text-gray-500">角色数量</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <SettingOutlined className="text-green-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">3</div>
                <div className="text-sm text-gray-500">权限规则</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                <UserOutlined className="text-orange-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">235</div>
                <div className="text-sm text-gray-500">授权用户</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                <FileTextOutlined className="text-purple-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">1250</div>
                <div className="text-sm text-gray-500">共享文档</div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Tabs
        defaultActiveKey="roles"
        items={[
          {
            key: 'roles',
            label: '角色管理',
            icon: <SafetyOutlined />,
            children: (
              <Card className="mt-4">
                <div className="flex items-center justify-between mb-4">
                  <Search
                    placeholder="搜索角色..."
                    allowClear
                    enterButton
                    size="middle"
                    style={{ width: 250 }}
                  />
                  <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenModal}>
                    添加角色
                  </Button>
                </div>
                <Table
                  columns={roleColumns}
                  dataSource={mockRoles}
                  rowKey="role"
                  pagination={false}
                />
              </Card>
            ),
          },
          {
            key: 'rules',
            label: '权限规则',
            icon: <SettingOutlined />,
            children: (
              <Card className="mt-4">
                <div className="flex items-center justify-between mb-4">
                  <Search
                    placeholder="搜索权限规则..."
                    allowClear
                    enterButton
                    size="middle"
                    style={{ width: 250 }}
                  />
                  <Button type="primary" icon={<PlusOutlined />}>
                    添加规则
                  </Button>
                </div>
                <Table
                  columns={ruleColumns}
                  dataSource={mockPermissionRules}
                  rowKey="id"
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total) => `共 ${total} 条记录`,
                  }}
                />
              </Card>
            ),
          },
        ]}
      />

      <Modal
        title="添加角色"
        open={isModalOpen}
        onOk={() => {
          form.validateFields().then(() => {
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
            name="role"
            label="角色标识"
            rules={[{ required: true, message: '请输入角色标识' }]}
          >
            <Input placeholder="如: custom_role" />
          </Form.Item>
          <Form.Item
            name="name"
            label="角色名称"
            rules={[{ required: true, message: '请输入角色名称' }]}
          >
            <Input placeholder="如: 自定义角色" />
          </Form.Item>
          <Form.Item
            name="permissions"
            label="权限列表"
            rules={[{ required: true, message: '请选择权限' }]}
          >
            <Select
              mode="multiple"
              options={permissionOptions}
              placeholder="请选择权限"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default PermissionManage