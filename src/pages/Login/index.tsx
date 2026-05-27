import { useState } from 'react'
import { Form, Input, Button, Checkbox, Card, Tabs } from 'antd'
import { PhoneOutlined, MailOutlined, ArrowRightOutlined, CheckCircleOutlined } from '@ant-design/icons'
import { useAuth } from '../../hooks/useAuth'

function LoginPage() {
  const [activeTab, setActiveTab] = useState('register')
  const [registerType, setRegisterType] = useState('phone')
  const [form] = Form.useForm()
  const { handleLogin, handleRegister } = useAuth()

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      if (activeTab === 'login') {
        await handleLogin(values.username, values.password)
      } else {
        await handleRegister(values.username, values.email || values.phone + '@example.com', values.password)
      }
    } catch (error) {
      console.error('Form validation failed:', error)
    }
  }

  const features = [
    { icon: <CheckCircleOutlined className="text-green-500" />, text: '永久免费' },
    { icon: <CheckCircleOutlined className="text-green-500" />, text: '实时在线' },
    { icon: <CheckCircleOutlined className="text-green-500" />, text: '设计/原型/开发' },
  ]

  return (
    <div className="min-h-screen w-full flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-500 to-amber-300" />
      <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400 via-teal-300 to-yellow-300 opacity-50" />
      
      <div className="relative z-10 flex items-center justify-center w-full max-w-6xl mx-auto px-8">
        <div className="flex-1 mr-16 text-white">
          <div className="mb-8">
            <span className="text-3xl font-bold tracking-tight">OnlyOffice</span>
          </div>
          <h1 className="text-4xl font-light mb-6 leading-relaxed">
            在同一个地方，构思、设计、
            <br />协作，让你和团队更加高效
          </h1>
          <div className="flex gap-6 flex-wrap">
            {features.map((feature, index) => (
              <span key={index} className="flex items-center gap-2 text-sm">
                {feature.icon}
                {feature.text}
              </span>
            ))}
          </div>
        </div>

        <Card className="w-[420px] shadow-2xl border-0 rounded-2xl">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={[
              {
                key: 'register',
                label: '注册账户',
              },
              {
                key: 'login',
                label: '登录',
              },
            ]}
            className="mb-6"
          />

          {activeTab === 'register' ? (
            <Form form={form} onFinish={handleSubmit}>
              <div className="flex gap-2 mb-4">
                <Button
                  type={registerType === 'phone' ? 'primary' : 'default'}
                  onClick={() => setRegisterType('phone')}
                  className="flex-1"
                  icon={<PhoneOutlined />}
                >
                  手机注册
                </Button>
                <Button
                  type={registerType === 'email' ? 'primary' : 'default'}
                  onClick={() => setRegisterType('email')}
                  className="flex-1"
                  icon={<MailOutlined />}
                >
                  邮箱注册
                </Button>
              </div>

              <Form.Item
                name={registerType === 'phone' ? 'phone' : 'email'}
                rules={[{ required: true, message: '请输入' + (registerType === 'phone' ? '手机号' : '邮箱') }]}
              >
                <Input
                  placeholder={registerType === 'phone' ? '输入手机号' : '输入邮箱'}
                  prefix={registerType === 'phone' ? <PhoneOutlined /> : <MailOutlined />}
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: '请输入密码' }]}
              >
                <Input.Password
                  placeholder="输入密码"
                  size="large"
                />
              </Form.Item>

              <Form.Item>
                <Checkbox>
                  已阅读并同意<a href="#">服务条款</a>和<a href="#">隐私协议</a>
                </Checkbox>
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" size="large" className="w-full h-12 text-base">
                  下一步
                  <ArrowRightOutlined className="ml-2" />
                </Button>
              </Form.Item>

              <div className="mt-6">
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-center text-gray-400 text-sm mb-3">其他方式</p>
                  <div className="flex gap-2">
                    <Button className="flex-1" icon={<span className="text-lg">微信图标</span>}>
                      微信登录
                    </Button>
                    <Button className="flex-1" icon={<span className="text-lg">钉钉图标</span>}>
                      钉钉登录
                    </Button>
                  </div>
                </div>
              </div>
            </Form>
          ) : (
            <Form form={form} onFinish={handleSubmit}>
              <Form.Item
                name="username"
                rules={[{ required: true, message: '请输入用户名' }]}
              >
                <Input
                  placeholder="用户名"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: '请输入密码' }]}
              >
                <Input.Password
                  placeholder="密码"
                  size="large"
                />
              </Form.Item>

              <Form.Item>
                <div className="flex justify-between items-center">
                  <Checkbox>记住我</Checkbox>
                  <a href="#" className="text-blue-500 text-sm">忘记密码？</a>
                </div>
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" size="large" className="w-full h-12 text-base">
                  登录
                </Button>
              </Form.Item>

              <div className="mt-6">
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-center text-gray-400 text-sm mb-3">其他方式</p>
                  <div className="flex gap-2">
                    <Button className="flex-1" icon={<span className="text-lg">微信图标</span>}>
                      微信登录
                    </Button>
                    <Button className="flex-1" icon={<span className="text-lg">钉钉图标</span>}>
                      钉钉登录
                    </Button>
                  </div>
                </div>
              </div>
            </Form>
          )}
        </Card>
      </div>

      <div className="absolute bottom-4 left-0 right-0 text-center text-white/60 text-xs">
        © 2024 OnlyOffice. All rights reserved. 
        <a href="#" className="mx-2">服务条款</a>
        <a href="#">隐私协议</a>
      </div>
    </div>
  )
}

export default LoginPage