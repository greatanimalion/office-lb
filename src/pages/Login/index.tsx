import { useEffect, useState } from 'react'
import { Form, Input, Button, Checkbox, Card, Tabs, Modal, message } from 'antd'
import { CheckCircleOutlined } from '@ant-design/icons'
import { useAuth } from '@/hooks/useAuth'
import gitlabIcon from '@/assets/icons/gitlab.svg'
import dingtalkIcon from '@/assets/icons/dingtalk.svg'
import weixinIcon from '@/assets/icons/weixin.svg'
import CaptchaCanvas from './components/captchaCanvas'
import { authAPI } from '@/services/api/auth'
import { Link } from 'react-router-dom'
function generateCaptchaText() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

function LoginPage() {
  const [activeTab, setActiveTab] = useState('login')
  const [modalCaptcha, setModalCaptcha] = useState(generateCaptchaText())
  const [captchaInput, setCaptchaInput] = useState('')
  const [showCaptchaModal, setShowCaptchaModal] = useState(false)
  const [form] = Form.useForm()
  const { handleLogin, handleRegister,handleOtherLogin } = useAuth()
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if(token){
      localStorage.setItem('token', token)
      handleOtherLogin()
    }
  }, [])

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      if (activeTab === 'login') {
        await handleLogin(values.email, values.password)
      } else {
        const res = await handleRegister(values.username, values.email, values.password, values.captcha)
        if (res.success) {
          message.success(res.message)
        } else {
          message.error(res.message)
        }
      }
    } catch (error) {
      console.error('Form validation failed:', error)
    }
  }

  const handleGetCaptcha = () => {
    setModalCaptcha(generateCaptchaText())
    setCaptchaInput('')
    setShowCaptchaModal(true)
  }

  const handleConfirmCaptcha = async () => {
    if (captchaInput.toLowerCase() === modalCaptcha.toLowerCase()) {
      form.setFieldsValue({ captcha: captchaInput })
      setShowCaptchaModal(false)
      const res = await authAPI.sendEmail(form.getFieldValue('email'))
      if (res.data.success) {
        message.success(res.data.message)
      } else {
        message.error(res.data.message)
      }
      setCaptchaInput('')
    } else {
      message.error('验证码错误，请重新输入')
      setModalCaptcha(generateCaptchaText())
      setCaptchaInput('')
    }
  }

  const features = [
    { icon: <CheckCircleOutlined className="text-green-500" />, text: '永久免费' },
    { icon: <CheckCircleOutlined className="text-green-500" />, text: '实时在线' },
    { icon: <CheckCircleOutlined className="text-green-500" />, text: '设计/原型/开发' },
  ]

  return (
    <div className="min-h-screen w-full flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-br from-blue-400 via-purple-500 to-amber-300" />

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
                key: 'login',
                label: '登录',
              },
              {
                key: 'register',
                label: '注册账户',
              },
            ]}
            className="mb-6"
          />

          {activeTab === 'login' ? (
            <Form form={form} onFinish={handleSubmit} layout="vertical">
              <Form.Item
                name='email'
                label="邮箱"
                rules={[{ required: true, message: '请输入邮箱' }]}
              >
                <Input
                  placeholder="输入邮箱"
                  size="large"
                />
              </Form.Item>
              <Form.Item
                name="password"
                label="密码"
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
                  登录
                </Button>
              </Form.Item>

              <div className="mt-6">
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-center text-gray-400 text-sm mb-3">其他方式</p>
                  <div className="flex gap-2">
                    <Button icon={<img src={gitlabIcon} alt="GitLab" />} onClick={() => authAPI.gitlabLogin()}>
                      <Link to='http://192.168.2.126:3001/api/oauth/gitlab'>GitLab登录</Link>
                    </Button>
                    <Button icon={<img src={dingtalkIcon} alt="DingTalk" />} onClick={() => authAPI.dingtalkLogin()}>
                      钉钉登录
                    </Button>
                    <Button icon={<img src={weixinIcon} alt="Weixin" />} onClick={() => authAPI.weixinLogin()}>
                      微信登录
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
                name="email"
                rules={[{ required: true, message: '请输入邮箱' }]}
              >
                <Input
                  placeholder="邮箱"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="captcha"
                rules={[{ required: true, message: '请获取验证码' }]}
              >
                <div className="flex gap-2">
                  <Input
                    placeholder="验证码"
                    size="large"

                  />
                  <Button
                    type="primary"
                    size="large"
                    onClick={handleGetCaptcha}
                    className="w-32"
                  >
                    获取验证码
                  </Button>
                </div>
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
                <Button type="primary" htmlType="submit" size="large" className="w-full h-12 text-base">
                  下一步
                </Button>
              </Form.Item>

              <div className="mt-6">
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-center text-gray-400 text-sm mb-3">其他方式</p>
                  <div className="flex gap-2">
                    <Button icon={<img src={gitlabIcon} alt="GitLab" />} onClick={() => handleLogin('', '', 1)}>
                      GitLab登录
                    </Button>
                    <Button icon={<img src={dingtalkIcon} alt="DingTalk" />} onClick={() => handleLogin('', '', 2)}>
                      钉钉登录
                    </Button>
                    <Button icon={<img src={weixinIcon} alt="Weixin" />} onClick={() => handleLogin('', '', 3)}>
                      微信登录
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

      <Modal
        title="邮箱验证码获取"
        open={showCaptchaModal}
        onCancel={() => setShowCaptchaModal(false)}
        footer={null}
        centered
        width={320}
      >
        <div className="flex flex-col items-center gap-4">
          <CaptchaCanvas
            captcha={modalCaptcha}
            onRefresh={() => setModalCaptcha(generateCaptchaText())}
          />
          <Input
            value={captchaInput}
            onChange={(e) => setCaptchaInput(e.target.value)}
            placeholder="请输入验证码"
            maxLength={4}
            className="w-full"
          />
          <div className="flex gap-2 w-full">
            <Button
              type="default"
              onClick={() => setShowCaptchaModal(false)}
              className="flex-1"
            >
              取消
            </Button>
            <Button
              type="primary"
              onClick={handleConfirmCaptcha}
              className="flex-1"
            >
              确认
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default LoginPage