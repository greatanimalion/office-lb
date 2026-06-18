import { Modal, Form, Input, Button, Space, Tag, Avatar, message, Tabs } from 'antd'
import {
  UserOutlined, LockOutlined, MailOutlined, CalendarOutlined, GitlabOutlined, WechatOutlined,
  DingdingOutlined, EditOutlined, CheckOutlined, RestOutlined, CloseOutlined
} from '@ant-design/icons'
import { useState } from 'react'
import useUserStore from '@/store/useUserStore'
import { formatDate } from '@/utils/day'

interface ProfileModalProps {
  open: boolean
  onClose: () => void
}

interface SocialBinding {
  provider: 'gitlab' | 'wechat' | 'dingding'
  name: string
  icon: React.ReactNode
  bound: boolean
  bindingTime?: string
}

export function ProfileModal({ open, onClose }: ProfileModalProps) {
  const { user, updateUser } = useUserStore()
  const [form] = Form.useForm()
  const [editMode, setEditMode] = useState(false)
  const [loading, setLoading] = useState(false)

  const socialBindings: SocialBinding[] = [
    { provider: 'gitlab', name: 'GitLab', icon: <GitlabOutlined />, bound: false },
    { provider: 'wechat', name: '微信', icon: <WechatOutlined />, bound: false },
    { provider: 'dingding', name: '钉钉', icon: <DingdingOutlined />, bound: false },
  ]

  const handleOpenEdit = () => {
    form.setFieldsValue({
      username: user?.username,
      email: user?.email,
    })
    setEditMode(true)
  }

  const handleSave = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)
      await updateUser(values)
      message.success('个人信息更新成功')
      setEditMode(false)
    } catch {
      message.error('更新失败')
    } finally {
      setLoading(false)
    }
  }

  const handleBindAccount = (provider: string) => {
    message.info(`正在跳转至${provider}授权页面...`)
  }

  const handleChangePassword = () => {
    Modal.confirm({
      title: '修改密码',
      content: (
        <Form layout="vertical">
          <Form.Item label="旧密码">
            <Input.Password placeholder="请输入旧密码" />
          </Form.Item>
          <Form.Item label="新密码">
            <Input.Password placeholder="请输入新密码" />
          </Form.Item>
          <Form.Item label="确认新密码">
            <Input.Password placeholder="请再次输入新密码" />
          </Form.Item>
        </Form>
      ),
      okText: '确认修改',
      cancelText: '取消',
      onOk: () => {
        message.success('密码修改成功')
      },
    })
  }

  return (
    <Modal
      title="个人中心"
      open={open}
      onCancel={() => {
        setEditMode(false)
        onClose()
      }}
      footer={null}
      width={700}
    >
      <div className="space-y-6">

        <div className="flex flex-col items-center">
          <Avatar
            src={user?.avatar}
            size={100}
            icon={<UserOutlined />}
            className="bg-blue-500 mb-4"
          />
          <h2 className="text-xl font-bold mb-1">{user?.username}</h2>
          <p className="text-gray-500 text-sm">{user?.email}</p>
        </div>


        <Tabs
          defaultActiveKey="info"
          className="bg-white rounded-lg p-4"
          items={[
            {
              key: 'info',
              label: '基本信息',
              children: (
                <>
                  {editMode ? (
                    <Form form={form} layout="vertical">
                      <Form.Item
                        name="username"
                        label="用户名"
                        rules={[{ required: true, message: '请输入用户名' }]}
                      >
                        <Input placeholder="请输入用户名" />
                      </Form.Item>
                      <Form.Item
                        name="email"
                        label="邮箱"
                        rules={[{ required: true, message: '请输入邮箱' }, { type: 'email', message: '请输入有效的邮箱' }]}
                      >
                        <Input placeholder="请输入邮箱" />
                      </Form.Item>
                      <Form.Item
                        name="phone"
                        label="手机号"
                      >
                        <Input placeholder="请输入手机号" />
                      </Form.Item>
                      <div className="flex justify-end gap-2">
                        <Button
                          type="primary"
                          ghost
                          icon={<CloseOutlined />}
                          onClick={() => setEditMode(false)}
                          loading={loading}
                          className="mt-4"
                        >取消</Button>
                        <Button
                          type="primary"
                          ghost
                          icon={<CheckOutlined />}
                          onClick={handleSave}
                          loading={loading}
                          className="mt-4"
                        >
                          保存修改
                        </Button>
                      </div>
                    </Form>
                  ) : (<>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <UserOutlined className="text-gray-400" />
                          <span className="text-gray-500">用户名</span>
                        </div>
                        <span className="font-medium">{user?.username}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <MailOutlined className="text-gray-400" />
                          <span className="text-gray-500">邮箱</span>
                        </div>
                        <span className="font-medium">{user?.email}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <CalendarOutlined className="text-gray-400" />
                          <span className="text-gray-500">注册时间</span>
                        </div>
                        <span className="font-medium">{user?.createdAt ? formatDate(user.createdAt) : '-'}</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <Button
                        type="primary"
                        ghost
                        icon={<EditOutlined />}
                        onClick={handleOpenEdit}
                        loading={loading}
                        className="mt-4 "
                      >
                        修改信息
                      </Button>
                    </div>
                  </>
                  )}
                </>
              ),
            },
            {
              key: 'binding',
              label: '账号绑定',
              children: (
                <div className="space-y-3">
                  {socialBindings.map((binding) => (
                    <div
                      key={binding.provider}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full">
                          {binding.icon}
                        </div>
                        <span className="font-medium">{binding.name}</span>
                      </div>
                      {binding.bound ? (
                        <div className="flex items-center gap-2">
                          <Tag color="green">已绑定</Tag>
                          <Button type="text" icon={<RestOutlined />} size="small">
                            重新绑定
                          </Button>
                        </div>
                      ) : (
                        <Button
                          type="primary"
                          ghost
                          size="small"
                          onClick={() => handleBindAccount(binding.provider)}
                        >
                          绑定
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              ),
            },
            {
              key: 'security',
              label: '安全设置',
              children: (
                <Space direction="vertical" className="w-full">
                  <Button
                    type="text"
                    icon={<LockOutlined />}
                    className="w-full justify-start"
                    onClick={handleChangePassword}
                  >
                    修改密码
                  </Button>
                </Space>
              ),
            },
          ]}
        />
      </div>
    </Modal>
  )
}
