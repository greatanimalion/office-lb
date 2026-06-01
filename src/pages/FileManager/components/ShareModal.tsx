import { useState } from 'react'
import { Modal, Form, Input, Select, DatePicker, InputNumber, Checkbox, message, Button, Space } from 'antd'
import { ShareAltOutlined, UserOutlined, LinkOutlined, LockOutlined, ClockCircleOutlined } from '@ant-design/icons'
import type { MyDocument } from '@/types'

const { RangePicker } = DatePicker

interface ShareModalProps {
  visible: boolean
  onCancel: () => void
  document: MyDocument | null
}

function ShareModal({ visible, onCancel, document }: ShareModalProps) {
  const [activeTab, setActiveTab] = useState<'internal' | 'external'>('internal')
  const [form] = Form.useForm()

  const handleSubmit = () => {
    const values = form.getFieldsValue()
    if (activeTab === 'internal') {
      message.success('内部共享设置成功')
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
          {activeTab === 'internal' ? '保存设置' : '生成链接'}
        </Button>,
      ]}
      width={500}
    >
      <div className=" mb-4 pb-2">
        <Space>
          <button
            type="button"
            className={`px-4 py-2   font-medium transition-colors ${
              activeTab === 'internal'
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
            className={`px-4 py-2   font-medium transition-colors ${
              activeTab === 'external'
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
                >
                  <Select.Option value="user">用户</Select.Option>
                  <Select.Option value="group">分组</Select.Option>
                </Select>
                <Input placeholder="输入用户名或分组名" style={{ width: 180 }} />
              </div>
              <Select
                placeholder="权限设置"
                style={{ width: '100%' }}
              >
                <Select.Option value="read">只读</Select.Option>
                <Select.Option value="edit">可编辑</Select.Option>
                <Select.Option value="admin">管理员</Select.Option>
              </Select>
            </div>
          </div>
        </Form>
      ) : (
        <Form form={form} layout="vertical">
          <div className="space-y-4">
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

            <Form.Item>
              <Checkbox>允许他人下载</Checkbox>
            </Form.Item>

            <Form.Item>
              <Checkbox>允许他人编辑</Checkbox>
            </Form.Item>
          </div>
        </Form>
      )}
    </Modal>
  )
}

export default ShareModal