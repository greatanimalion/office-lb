import { Form, Input, Modal, Checkbox, message } from 'antd'
import { useMemo } from 'react'
import { PermissionType } from '@/types'
import type { MyDocument } from '@/types/file'
import { fileAPI } from '@/services/api/file';
import { numToPermisson, permissonToNum } from '@/utils/permission';

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

interface BasicSettingsModalProps {
  open: boolean
  doc: MyDocument | null
  defaultPermissions: string|number
  onCancel: () => void
  onSaved: () => void
}

export function BasicSettingsModal({ open, doc, onCancel, onSaved, defaultPermissions }: BasicSettingsModalProps) { 
  const [form] = Form.useForm()
  const fileExt = useMemo(() => {
    if (!doc) return ''
    const m = doc.title.match(/\.([^.]+)$/)!
    return m?.[0] || ''
  }, [doc])
  const permissions = useMemo(() => {
    if(!doc) return []
    return numToPermisson(doc.permission || defaultPermissions)
  }, [doc])
  const handleSave = async () => {
    const values = await form.validateFields()
    console.log(values)
    if (!doc||!values) return 
    try {
      await fileAPI.updateDocument(doc!.id, {
        title: form.getFieldValue('title').toString()+fileExt,
        permission: permissonToNum(form.getFieldValue('permissions')),
      })
      message.success('基本信息已保存')
      onSaved()
    } catch (error) {
      message.error('保存失败，请稍后重试')
    }
  }

  return (
    <Modal
      title={`基本信息与权限 - ${doc?.title || ''}`}
      open={open}
      onOk={handleSave}
      onCancel={onCancel}
      okText="保存"
      cancelText="取消"
      width={560}
    >
      <div className="mt-2">
        <div className="flex items-center gap-2 mb-4 text-base">
        </div>
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="文件名称"
            rules={[{ required: true, message: '请输入文件名称' }]}
            initialValue={doc?.title.replace(fileExt, '') || ''}
          >
            <Input placeholder="请输入文件名称" suffix={<span>{fileExt}</span>} />
          </Form.Item>
          <Form.Item
            name="permissions"
            label="文件权限设置(自动覆盖文件夹权限)"
            initialValue={permissions}
          >
            <Checkbox.Group options={permissionOptions} />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  )
}

export default BasicSettingsModal
