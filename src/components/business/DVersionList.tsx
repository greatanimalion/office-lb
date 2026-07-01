import { useEffect, useState } from 'react'
import { Button, Empty, Spin, message, Tag, Popconfirm } from 'antd'
import {
    HistoryOutlined,
} from '@ant-design/icons'
import { formatDate } from '@/utils/day'
import { formatFileSize } from '@/utils/file'
import type { DocumentVersion } from '@/types/file'
import { fileAPI } from '@/services/api/file'

type DVersionListProps = {
    documentId: number
    cb?: () => void
}

/**
 * @param documentId 文档ID
 * @param cb 回调函数, 当版本回溯成功时调用
*/
export function DVersionList({ documentId, cb }: DVersionListProps) {
    const [loading, setLoading] = useState(true)
    const [versions, setVersions] = useState<DocumentVersion[]>([])
    const [vn, setVn] = useState<number>(-1)
    const handleDeleteDVersion = async (versionId: number) => {
        if (!documentId || !versionId) return
        try {
            const response = await fileAPI.deleteDocumentVersion(versionId)
            if (!response.data.success) return message.error(response.data.message || '删除失败')
            message.success('版本删除成功')
            await getVersions()
            cb?.()
        } catch {
            message.error('删除失败')
        }
    }
    async function getVersions() {
        setLoading(true)
        const response = await fileAPI.getDocumentVersions(documentId)
        if (!response.data.success) return message.error(response.data.message || '获取版本记录失败')
        setVersions(response.data.data)
        setVn(response.data.currentVersion)
        setLoading(false)
    }
    const handleRevertVersion = async (versionId: number) => {
        if (!documentId || !versionId) return
        try {
            const response = await fileAPI.revertToVersion(documentId, versionId)
            if (!response.data.success) return message.error(response.data.message || '回溯失败')
            message.success('版本回溯成功')
            await getVersions()
            cb?.()
        } catch {
            message.error('回溯失败')
        }
    }
    useEffect(() => {
        getVersions()
    }, [documentId])

    return (
        <>
            {loading ? (
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
                            className="flex items-center   justify-between p-4   rounded-lg   "
                        >
                            <div className="flex-1 ">
                                <div className="flex items-center gap-2">
                                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">V{version.version_number}</span>
                                    <span className="font-medium text-gray-800">{version.filename}</span>
                                    <span className="text-sm text-gray-400">|</span>
                                    <span className="text-sm text-gray-400">{formatFileSize(version.filesize)}</span>
                                </div>
                                <div className="flex items-center gap-3 mt-1.5   text-gray-400">
                                    <span>{formatDate(version.created_at)}，由 <Tag>{version.alter_by_username}</Tag>{version.version_number == 1 ? '上传' : '最后修改'}</span>
                                </div>
                            </div>
                            {vn == version.version_number ? <Button type="text">当前版本</Button> : <>
                                <Button
                                    type="link"
                                    ghost
                                    icon={<HistoryOutlined />}
                                    className="mr-2"
                                    onClick={() => handleRevertVersion(version.id)}
                                >
                                    回溯
                                </Button>
                                <Popconfirm
                                    title="确认删除该版本吗？"
                                    onConfirm={() => handleDeleteDVersion(version.id)}
                                    key={version.id}
                                    okText="确认"
                                    cancelText="取消"
                                >
                                    <Button type="text" danger >
                                        删除版本
                                    </Button>
                                </Popconfirm>
                            </>}
                        </div>
                    ))}
                </div>
            )}
        </>

    )
}

export default DVersionList
