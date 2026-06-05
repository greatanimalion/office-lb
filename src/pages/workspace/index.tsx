import { useEffect, useState } from 'react'
import { Button, Modal, Form, Input, message, Avatar, Popconfirm, Empty, Table, Space } from 'antd'
import { PlusOutlined, TeamOutlined, FileTextOutlined, UserOutlined, DeleteOutlined } from '@ant-design/icons'
import useGroupStore from '@/store/useGroupStore'
import type { Group } from '@/types'
import { formatDate } from '@/utils/day'
import { GroupDetail } from './components'

function Workspace() {
  const { groups, loading, fetchGroups, createGroup, deleteGroup, setCurrentGroup } = useGroupStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form] = Form.useForm()
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null)

  useEffect(() => {
    fetchGroups()
  }, [fetchGroups])

  const handleCreateGroup = async () => {
    try {
      const values = await form.validateFields()
      const result = await createGroup(values)
      if (result) {
        message.success('创建成功')
        setIsModalOpen(false)
        form.resetFields()
      } else {
        message.error('创建失败')
      }
    } catch {
      message.error('请填写组名称')
    }
  }

  const handleDeleteGroup = async (id: number) => {
    const success = await deleteGroup(id)
    if (success) {
      message.success('删除成功')
    } else {
      message.error('删除失败')
    }
  }

  const handleGroupClick = (group: Group) => {
    setCurrentGroup(group)
    setSelectedGroup(group)
  }

  const handleBack = () => {
    setSelectedGroup(null)
  }

  const groupColumns = [
    {
      title: '组名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Group) => (
        <div className="flex items-center gap-3">
          <Avatar
            src={record.avatar}
            icon={<TeamOutlined />}
            className="bg-blue-500"
          />
          <div>
            <div className="font-medium">{text}</div>
            {record.description && (
              <div className="text-gray-400 text-sm">{record.description}</div>
            )}
          </div>
        </div>
      ),
    },
    {
      title: '成员数',
      dataIndex: 'memberCount',
      key: 'memberCount',
      width: 100,
      render: (count: number) => (
        <div className="flex items-center gap-1">
          <UserOutlined className="text-gray-400" />
          <span>{count}</span>
        </div>
      ),
    },
    {
      title: '文档数',
      dataIndex: 'documentCount',
      key: 'documentCount',
      width: 100,
      render: (count: number) => (
        <div className="flex items-center gap-1">
          <FileTextOutlined className="text-gray-400" />
          <span>{count}</span>
        </div>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (text: string) => formatDate(text),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_: unknown, record: Group) => (
        <Space>
          <Button type="link" onClick={() => handleGroupClick(record)}>
            查看
          </Button>
          <Popconfirm
            title="确定删除该组吗？"
            onConfirm={() => handleDeleteGroup(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  if (selectedGroup) {
    return <GroupDetail groupId={selectedGroup.id} onBack={handleBack} />
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold mb-1">工作台</h2>
          <p className="text-gray-500">管理您的团队和工作组</p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
        >
          创建组
        </Button>
      </div>

        {groups.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="暂无工作组"
          >
            <Button type="primary" onClick={() => setIsModalOpen(true)}>
              创建第一个组
            </Button>
          </Empty>
        ) : (
          <Table
            columns={groupColumns}
            dataSource={groups}
            rowKey="id"
            loading={loading}
            pagination={false}
            className="h-full"
          />
        )}
      <Modal
        title="创建工作组"
        open={isModalOpen}
        onOk={handleCreateGroup}
        onCancel={() => {
          setIsModalOpen(false)
          form.resetFields()
        }}
        okText="创建"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="组名称"
            rules={[{ required: true, message: '请输入组名称' }]}
          >
            <Input placeholder="请输入组名称" />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea placeholder="请输入组描述（可选）" rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Workspace
