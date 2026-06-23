import { useEffect, useState } from 'react'
import { Button, Space, Empty, Spin, message, Modal, Form, Input, Checkbox, Transfer, Breadcrumb } from 'antd'
import {
  DeleteOutlined,
  FolderOutlined,
  EditOutlined,
  UploadOutlined,
  FileTextOutlined,
  FileWordOutlined,
  FilePdfOutlined,
  ArrowLeftOutlined,
  SearchOutlined,
  EyeOutlined,
  HistoryOutlined,
} from '@ant-design/icons'
import useGroupStore from '@/store/useGroupStore'
import useFileStore from '@/store/useFileStore'
import { groupAPI } from '@/services/api/group'
import { formatDate } from '@/utils/day'
import { PermissionType } from '@/types'
import { formatFileSize } from '@/utils/file'
import { permissonToBinary } from '@/utils/permission'
import type { Folder, MyDocument } from '@/types/file'
import type { DocumentVersion } from '@/types/file'
import { fileAPI } from '@/services/api/file'
const { Search } = Input

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
const getFileIcon = (title: string) => {
  const ext = title.split('.').pop()?.toLowerCase()
  switch (ext) {
    case 'doc':
    case 'docx':
      return <FileWordOutlined className="text-blue-600 text-xl" />
    case 'pdf':
      return <FilePdfOutlined className="text-red-500 text-xl" />
    default:
      return <FileTextOutlined className="text-gray-400 text-xl" />
  }
}
export function GroupFiles({ groupId }: GroupFilesProps) {
  const { getFolders, folders, documents, refreshDocuments, pushPath, popPath, pathFolder } = useGroupStore()
  const { fetchODocuments, ODocuments } = useFileStore()
  const [loading, setLoading] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [selectedDocIds, setSelectedDocIds] = useState<number[]>([])
  const [form] = Form.useForm()
  const [versionModalVisible, setVersionModalVisible] = useState(false)
  const [versions, setVersions] = useState<DocumentVersion[]>([])
  const [versionsLoading, setVersionsLoading] = useState(false)
  const [selectedDoc, setSelectedDoc] = useState<MyDocument | null>(null)

  const handleOpenVersionModal = async (doc: MyDocument) => {
    setSelectedDoc(doc)
    setVersionsLoading(true)
    try {
      const response = await fileAPI.getDocumentVersions(doc.id)
      setVersions(response.data.data || [])
    } catch {
      setVersions([])
    } finally {
      setVersionsLoading(false)
    }
    setVersionModalVisible(true)
  }

  const handleRevertVersion = async (versionId: number, v: number) => {
    if (!selectedDoc) return
    try {
      const response = await fileAPI.revertToVersion(selectedDoc.id, versionId)
      if (!response.data.success) return message.error(response.data.message || '回溯失败')
      message.success('版本回溯成功')
      refreshDocuments()
      setVersionModalVisible(false)
    } catch {
      message.error('回溯失败')
    }
  }

  const handleOpenUploadModal = async () => {
    await fetchODocuments()
    setSelectedDocIds([])
    setIsUploadModalOpen(true)
  }

  useEffect(() => {
    setLoading(true)
    getFolders().finally(() => setLoading(false))
    refreshDocuments()
  }, [groupId, getFolders])

  const handleFolderClick = (folder: Folder) => {
    pushPath(folder)
    refreshDocuments()
    getFolders()
  }

  const handleBack = () => {
    popPath()
  }

  const handleDeleteDocument = async (docId: number) => {
    try {
      await groupAPI.deleteDocument?.(groupId, docId)
      message.success('删除成功')
      getFolders()
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
      const permisson = permissonToBinary(folderData.permissions)
      if (permisson == 0) return message.error('权限不能为空')
      await groupAPI.createFolder(groupId, permisson, folderData.name, pathFolder[pathFolder.length - 1]?.id)
      message.success('文件夹创建成功')
      setIsCreateModalOpen(false)
      form.resetFields()
      getFolders()
    } catch (error) {
      message.error('创建失败')
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          {pathFolder.length > 0 && (
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={handleBack}
            >
              返回上一级
            </Button>
          )}
          <Breadcrumb>
            {pathFolder.map((item) => (
              <Breadcrumb.Item key={item.id ?? 'root'}>
                {item.filename}
              </Breadcrumb.Item>
            ))}
          </Breadcrumb>
        </div>
        <div className="flex gap-2">
          <Search
            placeholder="搜索..."
            allowClear
            enterButton={<SearchOutlined />}
            style={{ width: 280 }}
            size="middle"
          />
          <Button
            type="dashed"
            icon={<UploadOutlined />}
            onClick={handleOpenUploadModal}
          >
            上传文档
          </Button>
          <Button
            type="primary"
            icon={<FolderOutlined />}
            onClick={() => setIsCreateModalOpen(true)}
          >
            创建文件夹
          </Button>
        </div>
      </div>
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Spin size="large" />
        </div>
      ) : folders.length === 0 && documents.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="暂无文件"
        />
      ) : (
        <div className="space-y-2">
          {/* 文件夹列表 */}
          {folders.map(folder => (
            <div
              key={folder.id}
              className="flex items-center justify-between p-3  shadow-md  bg-white rounded-lg   transition-all cursor-pointer"
              onClick={() => handleFolderClick(folder)}
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <FolderOutlined className="text-amber-500 text-xl" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-amber-800">
                    {folder.filename}
                  </div>
                  <div className="text-sm text-amber-400/70 mt-0.5">
                    {formatDate(folder.createdAt)}
                  </div>
                </div>
              </div>
              <Space onClick={(e) => e.stopPropagation()}>
                <Button type="text" icon={<EditOutlined />} size="small">编辑</Button>
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  size="small"
                  onClick={() => handleDeleteDocument(folder.id)}
                >
                  删除
                </Button>
              </Space>
            </div>
          ))}
          {/* 文档列表 */}
          {documents.map(doc => {
            const icon = getFileIcon(doc.title)
            return (
              <div
                key={doc.id}
                className={`flex items-center justify-between p-3 bg-white shadow-md rounded-lg  transition-all`}
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                    {icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">
                      {doc.title}
                    </div>
                    <div className="text-sm text-gray-400 mt-0.5">
                      {formatFileSize(doc.fileSize || 0)} - {formatDate(doc.created_at)}
                    </div>
                  </div>
                </div>
                <Space>
                  <Button type="text" icon={<EyeOutlined />} size="small" onClick={() => window.open(`/documents/${doc.id}/edit`, '_blank')}>查看</Button>
                  <Button type="text" icon={<HistoryOutlined />} size="small" onClick={() => handleOpenVersionModal(doc)}>版本回溯</Button>
                  <Button type="text" danger icon={<DeleteOutlined />} size="small" onClick={() => handleDeleteDocument(doc.id)}>删除</Button>
                </Space>
              </div>
            )
          })}
        </div>
      )}
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

      <Modal
        title="上传文档到组"
        open={isUploadModalOpen}
        onOk={async () => {
          if (selectedDocIds.length === 0) {
            message.warning('请选择要上传的文档')
            return
          }
          try {
            const currentFolder = pathFolder[pathFolder.length - 1]
            for (const docId of selectedDocIds) {
              const owner_type = currentFolder ? "folder" : "group"
              await fileAPI.upLoadToGroup(docId, currentFolder ? currentFolder.id : groupId, owner_type)
            }
            await refreshDocuments()
            message.success('文档上传成功')
            setIsUploadModalOpen(false)
            setSelectedDocIds([])
            getFolders()
          } catch {
            message.error('上传失败')
          }
        }}
        onCancel={() => {
          setIsUploadModalOpen(false)
          setSelectedDocIds([])
        }}
        okText="确认上传"
        cancelText="取消"
        width={600}
      >
        <Transfer
          dataSource={Array.isArray(ODocuments) ? ODocuments.map(doc => ({
            key: doc.id.toString(),
            title: doc.title,
            description: `${formatFileSize(doc.fileSize || 0)} - ${formatDate(doc.created_at)}`,
          })) : []}
          targetKeys={selectedDocIds.map(id => id.toString())}
          onChange={(targetKeys) => setSelectedDocIds(targetKeys.map(Number))}
          render={item => item.title}
          titles={['我的文档', '待上传']}
          styles={{
            section: {
              width: '250px',
              height: '300px',
            },
          }}
          locale={{
            itemUnit: '项',
            itemsUnit: '项',
            remove: '移除',
            selectAll: '全选',
            selectCurrent: '选择当前页',
            deselectAll: '取消全选',
            selectInvert: '反选',
            removeAll: '清空',
            searchPlaceholder: '搜索',
            notFoundContent: '无匹配数据',
          }}
        />
      </Modal>

      <Modal
        title={`版本历史 - ${selectedDoc?.title || selectedDoc?.filename || ''}`}
        open={versionModalVisible}
        onCancel={() => {
          setVersionModalVisible(false)
          setVersions([])
        }}
        footer={null}
        width={600}
      >
        {versionsLoading ? (
          <div className="flex items-center justify-center py-12">
            <Spin size="large" />
          </div>
        ) : versions.length === 0 ? (
          <Empty description="暂无版本记录" />
        ) : (
          <div className="space-y-3">
            {versions.map((version) => (
              <div
                key={version.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">V{version.version_number}</span>
                    <span className="font-medium text-gray-800">{version.filename}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5 text-sm text-gray-400">
                    <span>{formatFileSize(version.filesize)}</span>
                    <span>|</span>
                    <span>{formatDate(version.created_at)}</span>
                  </div>
                </div>
                {selectedDoc.version_number == version.version_number ? <Button type="text">当前版本</Button>: <Button
                  type="primary"
                  ghost
                  icon={<HistoryOutlined />}
                  size="small"
                  onClick={() => handleRevertVersion(version.id, version.version_number)}
                >
                  回溯
                </Button>}
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  )
}

export default GroupFiles
