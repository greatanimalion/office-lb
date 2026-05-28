import { useState, useEffect } from 'react'
import { Table, Upload, Button, Input, Space, Popconfirm, message, Tag, Progress } from 'antd'
import {
  UploadOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  FileTextOutlined,
  FileUnknownOutlined
} from '@ant-design/icons'
import useFileStore from '@/store/useFileStore'
import type { MyDocument } from '@/types'

const { Search } = Input

function getFileIcon(ext: string) {
  const iconMap: Record<string, any> = {
    doc: FileTextOutlined,
    docx: FileTextOutlined,
  }
  const Icon = iconMap[ext.toLowerCase()] || FileUnknownOutlined
  return <Icon className="text-blue-500" />
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function FileManager() {
  const { myDocuments, loading, fetchMyDocuments, deleteDocument, createDocument,updateDocument } = useFileStore()
  const [searchText, setSearchText] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const docList = Array.isArray(myDocuments) ? myDocuments : []
  useEffect(() => {
    fetchMyDocuments()
  }, [fetchMyDocuments])

  const handleSearch = (value: string) => {
    setSearchText(value)
    fetchMyDocuments({ search: value })
  }

  const handleUpload = async (file: any) => {
    setUploading(true)
    setUploadProgress(0)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const result = await createDocument(formData)
      if (result) {
        message.success(`文件 "${result.title}" 上传成功`)
      } else {
        message.error('文件上传失败')
      }
    } catch (error) {
      message.error('文件上传失败')
    } finally {
      setUploading(false)
      setUploadProgress(100)
      setTimeout(() => setUploadProgress(0), 1000)
    }

    return false
  }

  const handleDelete = async (id: number, title: string) => {
    const success = await deleteDocument(id)
    if (success) {
      message.success(`文件 "${title}" 删除成功`)
    } else {
      message.error('文件删除失败')
    }
  }

  const columns = [
    {
      title: '文件名',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
      render: (text: string) => {
        const ext = text.split('.').pop() || ''
        return (
          <div className="flex items-center gap-3">
            {getFileIcon(ext)}
            <span>{text}</span>
          </div>
        )
      },
    },
    {
      title: '大小',
      dataIndex: 'fileSize',
      key: 'fileSize',
      width: 100,
      render: (text: number) => formatFileSize(text || 0),
    },
    {
      title: '类型',
      dataIndex: 'title',
      key: 'type',
      width: 100,
      render: (text: string) => {
        const ext = text.split('.').pop()?.toUpperCase() || '未知'
        return <Tag color="gray">{ext}</Tag>
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (text: string) => formatDate(text),
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 180,
      render: (text: string) => formatDate(text),
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_: unknown, record: MyDocument) => (
        <Space size="middle">
          <Button type="text" icon={<EyeOutlined />}>预览</Button>
          <Button type="text" icon={<EditOutlined />}>编辑</Button>
          <Popconfirm
            title={`确定删除文件 "${record.title}" 吗？`}
            onConfirm={() => handleDelete(record.id, record.title)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="text" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div>
      {/* 顶部操作栏 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold mb-2">文档管理</h2>
          <p className="text-gray-500">管理您的文档文件</p>
        </div>
        <Space>
          <Search
            placeholder="搜索文档..."
            allowClear
            enterButton
            size="middle"
            style={{ width: 300 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onSearch={handleSearch}
          />
          <Upload.Dragger
            name="file"
            accept=".doc,.docx"
            beforeUpload={handleUpload}
            fileList={[]}
            disabled={uploading}
          >
             <UploadOutlined /> {uploading ? '上传中...' : '上传文档'}
          </Upload.Dragger>
        </Space>
      </div>

      {/* 上传进度条 */}
      {uploadProgress > 0 && (
        <div className="mb-4">
          <Progress
            percent={uploadProgress}
            status={uploadProgress === 100 ? 'success' : 'active'}
            strokeColor={{
              '0%': '#10b981',
              '100%': '#3b82f6',
            }}
          />
        </div>
      )}

      {/* 文档统计卡片 */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600">{docList.length}</div>
          <div className="text-sm text-gray-600">总文档数</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600">0</div>
          <div className="text-sm text-gray-600">已分享</div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-yellow-600">
            {formatFileSize(docList.reduce((sum, d) => sum + (d.fileSize || 0), 0))}
          </div>
          <div className="text-sm text-gray-600">总大小</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-600">
            {new Set(docList.map(d => d.title.split('.').pop())).size}
          </div>
          <div className="text-sm text-gray-600">文件类型</div>
        </div>
      </div>

      {/* 文档列表 */}
      <div className="bg-white rounded-lg shadow p-6">
        <Table
          columns={columns}
          dataSource={docList}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
          bordered={false}
          className="w-full"
        />
      </div>
    </div>
  )
}

export default FileManager