import { useEffect, useState } from 'react'
import { Table, Button, Space, Card, Empty, Spin, message, Modal, Form, Input, Checkbox } from 'antd'
import {
  DeleteOutlined,
  FolderOutlined,
  EditOutlined,
} from '@ant-design/icons'
import useGroupStore from '@/store/useGroupStore'
import { groupAPI } from '@/services/api/group'
import { formatDate } from '@/utils/day'
import { PermissionType } from '@/types'
import { formatFileSize } from '@/utils/file'
import { permissonToBinary } from '@/utils/permission'
import type { Folder } from '@/types/file'
import type { ColumnsType } from 'antd/es/table'

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

interface GroupFilesProps {
  groupId: number
}

export function GroupFiles({ groupId }: GroupFilesProps) {
  const { getFolders, currentFolder, folders } = useGroupStore()
  const [loading, setLoading] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [form] = Form.useForm()

  useEffect(() => {
    setLoading(true)
    getFolders(groupId).finally(() => setLoading(false))
  }, [groupId, getFolders])

  const handleDeleteDocument = async (docId: number) => {
    try {
      await groupAPI.deleteDocument?.(groupId, docId)
      message.success('删除成功')
      getFolders(groupId)
    } catch {
      message.error('删除失败')
    }
  }

  const handleCreateFolder = async () => {
    try {
      const values = await form.validateFields()
      const folderData = {
        name: values.name,
        permissions: values.permissions || []
      }
      await groupAPI.createFolder(groupId, permissonToBinary(folderData.permissions), folderData.name, currentFolder?.id)
      message.success('文件夹创建成功')
      setIsCreateModalOpen(false)
      form.resetFields()
      getFolders(groupId)
    } catch (error) {
      message.error('创建失败')
    }
  }

  const columns: ColumnsType<Folder> = [
    {
      title: '文件名',
      dataIndex: 'filename',
      key: 'filename',
      ellipsis: true,
    },
    {
      title: '大小',
      dataIndex: 'fileSize',
      key: 'fileSize',
      width: 100,
      render: (size: number) => size ? formatFileSize(size || 0) : '',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 160,
      render: (text: string) => formatDate(text),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: unknown, record: Folder) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => { }}
          >编辑
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

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-gray-500 text-sm">查看组内所有成员上传的文件</p>
        </div>
        <Button
          type="primary"
          icon={<FolderOutlined />}
          onClick={() => setIsCreateModalOpen(true)}
        >
          创建文件夹
        </Button>
      </div>

      <Card className="flex-1">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Spin size="large" />
          </div>
        ) : folders.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="暂无文件"
          />
        ) : (
          <Table
            columns={columns}
            dataSource={folders}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条记录`,
            }}
          />
        )}
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
