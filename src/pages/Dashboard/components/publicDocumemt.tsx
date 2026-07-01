import { useState, useEffect } from 'react'
import { Card, Table, Tag, Button, Input, Modal, Transfer, message } from 'antd'
import { formatDate } from '@/utils/day'
import { formatFileSize } from '@/utils/file'
import { fileAPI } from '@/services/api/file'
import type { MyDocument } from '@/types'
import useUserStore from '@/store/useUserStore'
import { Link } from 'react-router-dom'
const { Search } = Input

function PublicDocumentList() {
    const [currentPage, setCurrentPage] = useState(1)
    const [total, setTotal] = useState(0)
    const [ODocuments, setODocuments] = useState<MyDocument[]>([])
    const [myDocuments, setMyDocuments] = useState<MyDocument[]>([])
    const [pageSize, setPageSize] = useState(5)
    const user = useUserStore((state) => state.user)
    const [selectedDocIds, setSelectedDocIds] = useState<number[]>([])
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [filter,setFilter] = useState('')
    const reflesh = async () => {
        setLoading(true)
        const res = await fileAPI.list({ page: currentPage, pageSize: pageSize,owner_id:0, owner_type: 'public',filter })
        if (res.data.success) {
            setODocuments(res.data.data.documents || [])
            setTotal(res.data.data.total || 0)
        }
        setLoading(false)
    }
    useEffect(() => {
        fileAPI.list({ page: 1, pageSize: 999999, owner_type: 'user', owner_id: user.id }).then(res => {
            if (res.data.success) {
                setMyDocuments(res.data.data.documents || [])
            }
        })
        reflesh()
    }, [])
    useEffect(() => {
        reflesh()
    }, [currentPage, pageSize])
    const docColumns = [
        {
            title: '文件名',
            dataIndex: 'title',
            key: 'title',
            ellipsis: true,
            width: 200,
            
        },{
            title: '类型',
            dataIndex: 'title',
            key: 'title',
            width: 80,
            render: (text: string) => {
                const ext = text.split('.').pop()?.toUpperCase() || '未知'
                return <Tag >{ext}</Tag>
            },
        },
        {
            title: '大小',
            dataIndex: 'fileSize',
            key: 'fileSize',
            width: 100,
            render: (text: number) => formatFileSize(text),
        },
        {
            title: '上传时间',
            dataIndex: 'updated_at',
            key: 'updatedAt',
            width: 130,
            render: (text: string) => formatDate(text),
        }, {
            title: '操作',
            dataIndex: 'actions',
            key: 'actions',
            width: 150,
            render: (_text: string, record: MyDocument) => (
                <div className="flex items-center gap-2">
                    <Button type="link" size="small" onClick={() => window.open(`/documents/${record.id}/preview`)}>在线预览</Button>
                    <Link to={`http://192.168.2.126:3001/api/documents/d/${record.id}`}>下载</Link>
                </div>
            ),
        }
    ]
    return (<>
        <Modal
            title="上传文档到公共空间"
            open={isUploadModalOpen}
            onOk={async () => {
                if (selectedDocIds.length === 0) {
                    message.warning('请选择要上传的文档')
                    return
                }
                try {
                    for (const docId of selectedDocIds) {
                        await fileAPI.upLoadTo(docId, 0, "public")
                    }
                    message.success('文档上传成功')
                    setIsUploadModalOpen(false)
                    reflesh()
                    setSelectedDocIds([])
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
                dataSource={Array.isArray(myDocuments) ? myDocuments.map(doc => ({
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
        <Card title="公共空间文档">
            <div className="flex justify-between items-center mb-4">
                <Search
                    placeholder="搜索文档..."
                    allowClear
                    value={filter}
                    onChange={(e)=>setFilter(e.target.value)}
                    size="middle"
                    onSearch={reflesh}
                    style={{ width: 250 }}
                />
                <Button type="primary" onClick={() => setIsUploadModalOpen(true)}>上传文档</Button>
            </div>
            <Table
                columns={docColumns}
                dataSource={ODocuments}
                loading={loading}
                rowKey="id"
                size="middle"
                pagination={{
                    pageSize,
                    total,
                    showSizeChanger: true,
                    showTotal: (total) => `共 ${total} 条记录`,
                }}
                onChange={(e)=>{
                    setCurrentPage(e.current)
                    setPageSize(e.pageSize)
                }}
            />
        </Card>
    </>

    )
}

export default PublicDocumentList
