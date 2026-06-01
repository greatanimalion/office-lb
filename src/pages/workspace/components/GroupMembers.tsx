import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Table, Button, Tag, Space, Card, Avatar, Empty, Spin, message, Popconfirm } from 'antd'
import {
  ArrowLeftOutlined,
  UserOutlined,
  DeleteOutlined,
  CrownOutlined
} from '@ant-design/icons'
import useGroupStore from '@/store/useGroupStore'
import type { GroupMember } from '@/types'
import { groupAPI } from '@/services/api/group'
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

function GroupMembers() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { currentGroup, members, fetchMembers } = useGroupStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    const groupId = Number(id)
    setLoading(true)
    Promise.all([
      fetchMembers(groupId),
    ]).finally(() => setLoading(false))
  }, [id, fetchMembers])

  const handleRemoveMember = async (userId: number) => {
    try {
      await groupAPI.removeMember(Number(id), userId)
      message.success('移除成功')
      fetchMembers(Number(id))
    } catch {
      message.error('移除失败')
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
            <Popconfirm
              title="确定移除该成员吗？"
              onConfirm={() => handleRemoveMember(record.id)}
              okText="确定"
              cancelText="取消"
            >
              <Button type="text" danger icon={<DeleteOutlined />}>
                移除
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ]

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-4 mb-6">
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/workspace')}
        >
          返回
        </Button>
        <div>
          <h2 className="text-xl font-bold mb-1">
            {currentGroup?.name || '组成员'}
          </h2>
          <p className="text-gray-500 text-sm">
            管理组成员，查看成员信息
          </p>
        </div>
      </div>

      <Card className="flex-1">
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
      </Card>
    </div>
  )
}

export default GroupMembers