import { Modal, Form, Select, Checkbox, InputNumber, message } from 'antd'
import { PermissionType } from '@/types'
import type { MyDocument } from '@/types/file'

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

interface TempPermissionModalProps {
  open: boolean
  doc: MyDocument | null
  form: any
  members: { id: number; username: string }[]
  onCancel: () => void
}

export function TempPermissionModal({ open, doc, form, members, onCancel }: TempPermissionModalProps) {
  const handleSave = () => {
    form.validateFields().then((values: any) => {
      const member = members.find(m => m.id === values.userId)
      message.success(`已为 ${member?.username || '所选成员'} 授予临时权限（有效期 ${values.expireHours} 小时）`)
      onCancel()
    })
  }

  return (
    <Modal
      title={`临时授权 - ${doc?.title || ''}`}
      open={open}
      onOk={handleSave}
      onCancel={() => {
        form.resetFields()
        onCancel()
      }}
      okText="确认授权"
      cancelText="取消"
      width={560}
    >
      <div className="mt-2">
        <div className="flex items-center gap-2 mb-4 text-base">

        </div>
        <p className="mb-4">选择成员并设置临时权限，到期后权限自动回收</p>
        <p className="mb-4">此权限等级最高，自动覆盖其他权限</p>
        <Form form={form} layout="vertical">
          <Form.Item
            name="userId"
            label="选择成员"
            rules={[{ required: true, message: '请选择成员' }]}
          >
            <Select
              placeholder="请选择成员"
              options={members.map(m => ({ value: m.id, label: m.username }))}
            />
          </Form.Item>
          <Form.Item
            name="permissions"
            label="临时权限"
            rules={[{ required: true, message: '请选择权限' }]}
            initialValue={[PermissionType.VIEW]}
          >
            <Checkbox.Group options={permissionOptions} />
          </Form.Item>
          <Form.Item
            name="expireHours"
            label="有效期（小时）"
            rules={[{ required: true, message: '请设置有效期' }]}
            initialValue={24}
          >
            <InputNumber min={1} max={720} className="w-full" placeholder="请输入有效期" />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  )
}

export default TempPermissionModal
