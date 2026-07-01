import { useState, useEffect } from 'react'
import { Table, Upload, Button, Input, Space, Popconfirm, message, Tag, Progress, Card, Statistic, Modal, Form } from 'antd'
import {
  UploadOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  ShareAltOutlined,
} from '@ant-design/icons'
import useFileStore from '@/store/useFileStore'
import type { MyDocument } from '@/types'
import { useFileUpload } from '@/hooks/useFileUpload'
import { useNavigate } from 'react-router-dom'
import ShareModal from './components/ShareModal'
import DVersionList from '@/components/business/DVersionList'
import { formatFileSize } from '@/utils/file'
const { Search } = Input


function FileManager() {
  const navigate = useNavigate()
  const { ODocuments, loading, fetchODocuments, deleteDocument } = useFileStore()
  const [searchText, setSearchText] = useState('')
  const {upload,uploading,progress} = useFileUpload()
  const [shareModalVisible, setShareModalVisible] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<MyDocument | null>(null)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [form] = Form.useForm()

  const handleOpenEditModal = async (document: MyDocument) => {
    form.setFieldsValue({ title: document.title })
    setSelectedDocument(document)
    setEditModalVisible(true)
  }

  const handleUpdateTitle = async () => {
    if (!selectedDocument) return
    try {
      await form.validateFields()
      // await fileAPI.update(selectedDocument.id, { title: values.title })
      message.success('文件名修改成功')
      setEditModalVisible(false)
      fetchODocuments()
    } catch {
      message.error('修改失败')
    }
  }


  const docList = Array.isArray(ODocuments) ? ODocuments : []
  useEffect(() => {
    fetchODocuments()
  }, [fetchODocuments])

  const handleSearch = (value: string) => {
    setSearchText(value)
    fetchODocuments({ page: 1, pageSize: 10 })
  }
  const handleUpload = async (file: any) => {
    try {
      const result = await upload(file)
      if (result) {
        message.success(`文件 "${result.filename}" 上传成功`)
        fetchODocuments({ page: 1, pageSize: 10 })
      } else {
        message.error('文件上传失败')
      }
    } catch (error) {
      message.error('文件上传失败')
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
   
    },
    {
      title: '大小',
      dataIndex: 'fileSize',
      key: 'fileSize',
      render: (text: number) => formatFileSize(text)
    },
    {
      title: '类型',
      dataIndex: 'title',
      key: 'type',
      render: (text: string) => {
        const ext = text.split('.').pop()?.toUpperCase() || '未知'
        return <Tag >{ext}</Tag>
      },
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'createdAt',
    },
    {
      title: '更新时间',
      dataIndex: 'updated_at',
      key: 'updatedAt',
    },{
      title: '版本号',
      dataIndex: 'version_number',
      key: 'version_number',
      render: (text: string) => {
        return <Tag>V{text}</Tag>
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 400,
      render: (_: unknown, record: MyDocument) => (
        <Space size="middle">
          <Button type="text" icon={<EyeOutlined />} onClick={() => { navigate(`/documents/${record.id}/inner-preview`); }}> 查看</Button>
          <Button type="text" icon={<EditOutlined />} onClick={() => handleOpenEditModal(record)}>编辑</Button>
           <Button type="text" icon={<ShareAltOutlined />} onClick={() => { setSelectedDocument(record); setShareModalVisible(true); }}>共享</Button>
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
      <ShareModal
        visible={shareModalVisible}
        onCancel={() => setShareModalVisible(false)}
        document={selectedDocument}
      />

      <Modal
        title="编辑文档"
        open={editModalVisible}
        onOk={handleUpdateTitle}
        onCancel={() => {
          setEditModalVisible(false)
          form.resetFields()
        }}
        okText="保存修改"
        cancelText="取消"
        width={700}
      >
        <div className="space-y-6">
          <div>
            <h3 className="font-medium mb-3">修改文件名</h3>
            <Form form={form} layout="vertical">
              <Form.Item
                name="title"
                rules={[{ required: true, message: '请输入文件名' }]}
              >
                <Input placeholder="请输入文件名" />
              </Form.Item>
            </Form>
          </div>

          <div>
            <h3 className="font-medium mb-3">版本历史</h3>
            <DVersionList documentId={selectedDocument?.id || 0} cb={()=>{setEditModalVisible(false)}} />
          </div>
        </div>
      </Modal>

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
            accept=".doc,.docx,.pdf,.txt,.xlsx,.xls,.ppt,.pptx"
            beforeUpload={handleUpload}
            fileList={[]}
            disabled={uploading}
          >
             <UploadOutlined /> {uploading ? '上传中...' : '上传文档'}
          </Upload.Dragger>
        </Space>
      </div>

      {/* 上传进度条 */}
      {progress > 0 && (
        <div className="mb-4">
          <Progress
            percent={progress}
            status={progress === 100 ? 'success' : 'active'}
            strokeColor={{
              '0%': '#10b981',
              '100%': '#3b82f6',
            }}
          />
        </div>
      )}

      {/* 文档统计卡片 */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className=" rounded-lg p-4">
           <Card>
            <Statistic title="文档总数" value={docList.length} />
          </Card>
        </div>
        <div className="  rounded-lg p-4">
           <Card>
            <Statistic title="已分享" value={0}  />
          </Card>
        </div>
        <div className="yellow-50 rounded-lg p-4">
           <Card>
            <Statistic title="文档总数" value={formatFileSize(docList.reduce((sum, d) => sum + (d.fileSize || 0), 0))}  />
          </Card>
         
        </div>
        <div className="  rounded-lg p-4">
           <Card>
            <Statistic title="文档类型" value={new Set(docList.map(d => d.title.split('.').pop())).size}  />
          </Card>
        </div>
      </div>

      {/* 文档列表 */}
      <div className="overflow-auto h-[calc(100vh-350px)]">
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
         
          className="w-full"
        />
    </div>
    </div>
  )
}

export default FileManager