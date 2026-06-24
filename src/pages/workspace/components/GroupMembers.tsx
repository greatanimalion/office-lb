import { useEffect, useState } from 'react'
import { Table, Button, Tag, Space, Empty, Spin, message, Avatar, Modal, Form, Select } from 'antd'
import {
  DeleteOutlined,
  UserOutlined,
  CrownOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import useGroupStore from '@/store/useGroupStore'
import type { GroupMember } from '@/types'
import { groupAPI } from '@/services/api/group'
import { authAPI } from '@/services/api/auth'
import { formatDate } from '@/utils/day'

function getRoleTagColor(role: string): string {
  switch (role) {
    case 'owner':
      return 'gold'
    case 'admin':
      return 'blue'
    default:
      return 'default'
  }
}

function getRoleName(role: string): string {
  switch (role) {
    case 'owner':
      return '所有者'
    case 'admin':
      return '管理员'
    default:
      return '成员'
  }
}

interface GroupMembersProps {
  groupId: number
}

export function GroupMembers({ groupId }: GroupMembersProps) {
  const { members, fetchMembers } = useGroupStore()
  const [loading, setLoading] = useState(true)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [form] = Form.useForm()
  const [userOptions, setUserOptions] = useState<{ value: number; label: string }[]>([])

  useEffect(() => {
    setLoading(true)
    Promise.all([
      fetchMembers(groupId),
      fetchUsers()
    ]).finally(() => setLoading(false))
  }, [groupId, fetchMembers])

  const fetchUsers = async () => {
    try {
      const res = await authAPI.getAllUser()
      if (res.data.success) {
        const existingUserIds = members.map(m => m.id)
        const availableUsers = res.data.user.filter(u => !existingUserIds.includes(u.id))
        setUserOptions(availableUsers.map(u => ({
          value: u.id,
          label: `${u.username} (${u.email || '第三方登录'})`
        })))
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
    }
  }

  const handleRemoveMember = async (userId: number) => {
    try {
      await groupAPI.removeMember(groupId, userId)
      message.success('移除成功')
      fetchMembers(groupId)
    } catch {
      message.error('移除失败')
    }
  }

  const handleAddMember = async () => {
    try {
      const values = await form.validateFields()
      await groupAPI.addMember(groupId, values.userId, values.role)
      message.success('添加成功')
      setIsAddModalOpen(false)
      form.resetFields()
      fetchMembers(groupId)
    } catch (error) {
      message.error('添加失败')
    }
  }

  const columns = [
    {
      title: '成员',
      dataIndex: 'username',
      key: 'username',
      render: (text: string, record: GroupMember) => (
        <div className="flex items-center gap-3">
          <Avatar
            src={record.avatar}
            icon={<UserOutlined />}
            className="bg-blue-500"
          />
          <div>
            <div className="font-medium">{text}</div>
            <div className="text-gray-400 text-xs">{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      width: 100,
      render: (role: string) => (
        <Tag color={getRoleTagColor(role)} icon={role === 'owner' ? <CrownOutlined /> : null}>
          {getRoleName(role)}
        </Tag>
      ),
    },
    {
      title: '加入时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 160,
      render: (text: string) => formatDate(text),
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_: unknown, record: GroupMember) => (
        <Space>
          {record.role !== 'owner' && (
            <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleRemoveMember(record.id)}>
              移除
            </Button>
          )}
        </Space>
      ),
    },
  ]

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-gray-500 text-sm">管理组成员，查看成员信息</p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            fetchUsers()
            setIsAddModalOpen(true)
          }}
        >
          添加成员
        </Button>
      </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Spin size="large" />
          </div>
        ) : members.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="暂无成员"
          />
        ) : (
          <Table
            columns={columns}
            dataSource={members}
            rowKey="id"
            pagination={false}
          />
        )}

      <Modal
        title="添加成员"
        open={isAddModalOpen}
        onOk={handleAddMember}
        onCancel={() => {
          setIsAddModalOpen(false)
          form.resetFields()
        }}
        okText="添加"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="userId"
            label="选择用户"
            rules={[{ required: true, message: '请选择要添加的用户' }]}
          >
            <Select
              placeholder="请选择用户"
              options={userOptions}
            />
          </Form.Item>
          <Form.Item
            name="role"
            label="角色"
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Select
              placeholder="请选择角色"
              options={[
                { value: 'admin', label: '管理员' },
                { value: 'member', label: '成员' },
              ]}
              defaultValue="member"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default GroupMembers
