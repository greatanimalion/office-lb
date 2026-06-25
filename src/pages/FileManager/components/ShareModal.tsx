import { useEffect, useState } from 'react'
import { Modal, Form, Input, Select, DatePicker, InputNumber, Checkbox, message, Button, Space } from 'antd'
import { ShareAltOutlined, UserOutlined, LinkOutlined, LockOutlined, ClockCircleOutlined } from '@ant-design/icons'
import { PermissionType, type MyDocument } from '@/types'
import { authAPI } from '@/services/api/auth'
import { groupAPI } from '@/services/api/group'
import useUserStore from '@/store/useUserStore'

const { RangePicker } = DatePicker

interface ShareModalProps {
  visible: boolean
  onCancel: () => void
  document: MyDocument | null
}
const options = [{
  label: '可编辑',
  value: PermissionType.EDIT,
}, {
  label: '可评论',
  value: PermissionType.COMMENT,
}, {
  label: '可下载',
  value: PermissionType.DOWNLOAD,
}
]
const permissionOptions: { value: PermissionType; label: string }[] = [
  { value: PermissionType.DOWNLOAD, label: '下载' },
  { value: PermissionType.EDIT, label: '编辑' },
  { value: PermissionType.COMMENT, label: '评论' },
]
function ShareModal({ visible, onCancel, document }: ShareModalProps) {
  const [activeTab, setActiveTab] = useState<'internal' | 'external'>('internal')
  const [userNames, setUserNames] = useState<{ name: string, id: number }[]>([])
  const [groupNames, setGroupNames] = useState<{ name: string, id: number }[]>([])
  const [selectedUserOrGroup, setSelectedUserOrGroup] = useState<string>("user")
  const [selectedUserOrGroupValue, setSelectedUserOrGroupValue] = useState<string>("")
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
  const user = useUserStore((state) => state.user)
  const [form] = Form.useForm()
  useEffect(() => {
    async function getNames() {
      try {
        const res = await authAPI.getAllUser()
        if (res.data.success) {
          setUserNames(res.data.user.map(u => ({ name: u.username, id: u.id })).filter(u => u.id !== user.id))
        }
        const res2 = await groupAPI.list()
        setGroupNames(res2.data.map(group => ({ name: group.name, id: group.id })))
      } catch (error) {
        console.log(error)
      }
    }
    getNames()
  }, [])
  const handleSubmit = () => {
    if (!selectedUserOrGroupValue) {
      message.error("请选择用户或分组")
      return
    }
    if (!selectedPermissions.length) {
      message.error("请选择权限")
      return
    }
    form.getFieldsValue()
    if (activeTab === 'internal') {
      const messageStr = selectedUserOrGroup === "user" ? "已分享至用户" + selectedUserOrGroupValue : "已分享至分组" + selectedUserOrGroupValue
      message.success(messageStr)
      console.log(selectedUserOrGroupValue, selectedUserOrGroup, selectedPermissions)
    } else {
      message.success('外链共享链接已生成')
    }
    onCancel()
    form.resetFields()
  }

  return (
    <Modal
      title={<div className="flex items-center gap-2">
        <ShareAltOutlined />
        <span>分享文档</span>
      </div>}
      open={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      footer={[
        <Button key="back" onClick={onCancel}>
          取消
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          {activeTab === 'internal' ? '分享' : '生成链接'}
        </Button>,
      ]}
      width={500}
    >
      <div className=" mb-4 pb-2">
        <Space>
          <button
            type="button"
            className={`px-4 py-2   font-medium transition-colors ${activeTab === 'internal'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            onClick={() => setActiveTab('internal')}
          >
            <span className="flex items-center gap-2">
              <UserOutlined />
              内部共享
            </span>
          </button>
          <button
            type="button"
            className={`px-4 py-2   font-medium transition-colors ${activeTab === 'external'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            onClick={() => setActiveTab('external')}
          >
            <span className="flex items-center gap-2">
              <LinkOutlined />
              外链共享
            </span>
          </button>
        </Space>
      </div>

      {activeTab === 'internal' ? (
        <Form form={form} layout="vertical">
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">共享方式：按用户/分组</p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Select
                  placeholder="选择用户或分组"
                  style={{ width: 250 }}
                  allowClear
                  value={selectedUserOrGroup}
                  onChange={(value) => { setSelectedUserOrGroup(value); setSelectedUserOrGroupValue("") }}
                >
                  <option value="user">用户</option>
                  <option value="group">分组</option>
                </Select>
                <Select
                  placeholder="选择用户或分组"
                  style={{ width: 250 }}
                  allowClear
                  value={selectedUserOrGroupValue}
                  onChange={setSelectedUserOrGroupValue}>
                  {selectedUserOrGroup === 'user' ? userNames.map(user => (
                    <Select.Option key={user.id} value={user.name}>{user.name}</Select.Option>
                  )) : groupNames.map(group => (
                    <Select.Option key={group.id} value={group.name}>{group.name}</Select.Option>
                  ))}
                </Select>
              </div>
              <Select
                mode="multiple"
                placeholder="权限设置"
                style={{ width: '100%' }}
                options={options}
                value={selectedPermissions}
                onChange={setSelectedPermissions}
                defaultValue={["可读", "可编辑", "可下载"]} />
            </div>
          </div>
        </Form>
      ) : (
        <Form form={form} layout="vertical">
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">分享链接</span>
              <span className="text-blue-500 text-sm font-mono">
                {document ? `/s/${document.id}` : '/s/xxxx'}
              </span>
            </div>

            <Form.Item label="设置密码">
              <div className="flex items-center gap-2">
                <LockOutlined className="text-gray-400" />
                <Input placeholder="设置访问密码（可选）" />
              </div>
            </Form.Item>

            <Form.Item label="有效期">
              <div className="flex items-center gap-2">
                <ClockCircleOutlined className="text-gray-400" />
                <RangePicker style={{ width: '100%' }} />
              </div>
            </Form.Item>
            <div className="flex justify-between">
              <Form.Item label="访问次数限制">
                <div className="flex items-center gap-2">
                  <InputNumber
                    placeholder="最大访问次数"
                    min={1}
                    max={9999}
                    style={{ width: 150 }}
                  />
                  <span className="text-gray-500">次</span>
                </div>
              </Form.Item>
              <Form.Item label="文档水印（可选）">
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="文档水印内容"
                    style={{ width: 150 }}
                  />
                  <span className="text-gray-500">内容</span>
                </div>
              </Form.Item>
            </div>


            <Form.Item name="permissions" label="权限设置">
              <Checkbox.Group options={permissionOptions} />
            </Form.Item>
          </div>
        </Form>
      )}
    </Modal>
  )
}

export default ShareModal