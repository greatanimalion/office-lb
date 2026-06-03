import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Table, Button, Tag, Space, Card, Empty, Spin, message, Avatar, Tabs, Modal, Form, Input, Checkbox } from 'antd'
import {
  ArrowLeftOutlined,
  FileTextOutlined,
  FileImageOutlined,
  FilePdfOutlined,
  FileExcelOutlined,
  FilePptOutlined,
  FileUnknownOutlined,
  EyeOutlined,
  DeleteOutlined,
  UserOutlined,
  FolderOutlined,
} from '@ant-design/icons'
import useGroupStore from '@/store/useGroupStore'
import type { GroupDocument, GroupMember } from '@/types'
import { groupAPI } from '@/services/api/group'
import { formatDate } from '@/utils/day'
import { PermissionType } from '@/types'
import { formatFileSize } from '@/utils/file'
import { permissonToBinary } from '@/utils/permission'
const permissionOptions: { value: PermissionType; label: string }[] = [
  { value: PermissionType.VIEW, label: '查看' },
  { value: PermissionType.DOWNLOAD, label: '下载' },
  { value: PermissionType.EDIT, label: '编辑' },
  { value: PermissionType.DELETE, label: '删除' },
  { value: PermissionType.COMMENT, label: '评论' },
  { value: PermissionType.CHANGE_PERMISSION, label: '修改权限' },
  { value: PermissionType.SHARE, label: '分享' },
  { value: PermissionType.MAKE_TEMPLATE, label: '设为模板' },
]

function getFileIcon(ext: string) {
  const iconMap: Record<string, React.ReactNode> = {
    doc: <FileTextOutlined className="text-blue-500" />,
    docx: <FileTextOutlined className="text-blue-500" />,
    pdf: <FilePdfOutlined className="text-red-500" />,
    xls: <FileExcelOutlined className="text-green-500" />,
    xlsx: <FileExcelOutlined className="text-green-500" />,
    ppt: <FilePptOutlined className="text-orange-500" />,
    pptx: <FilePptOutlined className="text-orange-500" />,
    jpg: <FileImageOutlined className="text-purple-500" />,
    jpeg: <FileImageOutlined className="text-purple-500" />,
    png: <FileImageOutlined className="text-purple-500" />,
  }
  return iconMap[ext.toLowerCase()] || <FileUnknownOutlined className="text-gray-400" />
}


function GroupFiles() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { currentGroup, documents, members, getFolders, fetchMembers,currentFolder } = useGroupStore()
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('files')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [form] = Form.useForm()

  useEffect(() => {
    if (!id) return
    const groupId = Number(id)
    setLoading(true)
    if (activeTab === 'files') {
      getFolders(groupId).finally(() => setLoading(false))
    } else {
      fetchMembers(groupId).finally(() => setLoading(false))
    }
  }, [id, activeTab, getFolders, fetchMembers])

  const handleDeleteDocument = async (docId: number) => {
    try {
      await groupAPI.deleteDocument?.(Number(id), docId)
      message.success('删除成功')
      getFolders(Number(id))
    } catch {
      message.error('删除失败')
    }
  }

  const handleRemoveMember = async (userId: number) => {
    try {
      await groupAPI.removeMember(Number(id), userId)
      message.success('移除成功')
      fetchMembers(Number(id))
    } catch {
      message.error('移除失败')
    }
  }

  const handleCreateFolder = async () => {
    try {
      const values = await form.validateFields()
      const folderData = {
        name: values.name,
        permissions: values.permissions || []
      }
      console.log(folderData)
      await groupAPI.createFolder(Number(id), permissonToBinary(folderData.permissions), folderData.name, currentFolder?.id)
      message.success('文件夹创建成功')
      setIsCreateModalOpen(false)
      form.resetFields()
      getFolders(Number(id))
    } catch (error) {
      message.error('创建失败')
    }
  }

  const columns = [
    {
      title: '文件名',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
      render: (text: string, record: GroupDocument) => {
        const ext = text.split('.').pop() || ''
        return (
          <div className="flex items-center gap-3">
            {getFileIcon(ext)}
            <div>
              <div className="font-medium">{text}</div>
              <div className="text-gray-400 text-xs">上传者: {record.uploaderName}</div>
            </div>
          </div>
        )
      },
    },
    {
      title: '大小',
      dataIndex: 'fileSize',
      key: 'fileSize',
      width: 100,
      render: (size: number) => formatFileSize(size || 0),
    },
    {
      title: '类型',
      dataIndex: 'title',
      key: 'type',
      width: 80,
      render: (text: string) => {
        const ext = text.split('.').pop()?.toUpperCase() || '未知'
        return <Tag color="gray">{ext}</Tag>
      },
    },
    {
      title: '上传时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 160,
      render: (text: string) => formatDate(text),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: unknown, record: GroupDocument) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/documents/${record.id}/preview`)}
          >
            预览
          </Button>
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteDocument(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ]

  const memberColumns = [
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
        <Tag color={role === 'owner' ? 'red' : role === 'admin' ? 'orange' : 'blue'}>
          {role === 'owner' ? '所有者' : role === 'admin' ? '管理员' : '成员'}
        </Tag>
      ),
    },
    {
      title: '加入时间',
      dataIndex: 'joinedAt',
      key: 'joinedAt',
      width: 160,
      render: (text: string) => formatDate(text),
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_: unknown, record: GroupMember) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleRemoveMember(record.id)}
        >
          移除
        </Button>
      ),
    },
  ]

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/workspace')}
          >
            返回
          </Button>
          <div>
            <h2 className="text-xl font-bold mb-1">
              {currentGroup?.name || '组详情'}
            </h2>
            <p className="text-gray-500 text-sm">
              {activeTab === 'files' ? '查看组内所有成员上传的文件' : '管理组成员'}
            </p>
          </div>
        </div>
        {activeTab === 'files' && (
          <Button
            type="primary"
            icon={<FolderOutlined />}
            onClick={() => setIsCreateModalOpen(true)}
          >
            创建文件夹
          </Button>
        )}
      </div>

      <Card className="flex-1">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: 'files',
              label: '组内文件',
              children: loading ? (
                <div className="flex items-center justify-center h-64">
                  <Spin size="large" />
                </div>
              ) : documents.length === 0 ? (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="暂无文件"
                />
              ) : (
                <Table
                  columns={columns}
                  dataSource={documents}
                  rowKey="id"
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total) => `共 ${total} 条记录`,
                  }}
                />
              ),
            },
            {
              key: 'members',
              label: '组成员',
              children: loading ? (
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
                  columns={memberColumns}
                  dataSource={members}
                  rowKey="id"
                  pagination={false}
                />
              ),
            },
          ]}
        />
      </Card>

      <Modal
        title="创建文件夹"
        open={isCreateModalOpen}
        onOk={handleCreateFolder}
        onCancel={() => {
          setIsCreateModalOpen(false)
          form.resetFields()
        }}
        okText="创建"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="文件夹名称"
            rules={[{ required: true, message: '请输入文件夹名称' }]}
          >
            <Input placeholder="请输入文件夹名称" />
          </Form.Item>
          <Form.Item name="permissions" label="权限设置">
            <Checkbox.Group options={permissionOptions} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default GroupFiles