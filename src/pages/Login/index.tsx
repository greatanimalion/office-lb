import { useState, useRef, useEffect } from 'react'
import { Form, Input, Button, Checkbox, Card, Tabs, Modal } from 'antd'
import { CheckCircleOutlined } from '@ant-design/icons'
import { useAuth } from '@/hooks/useAuth'
import gitlabIcon from '@/assets/icons/gitlab.svg'
import dingtalkIcon from '@/assets/icons/dingtalk.svg'
import weixinIcon from '@/assets/icons/weixin.svg'
function generateCaptchaText() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

function CaptchaCanvas({ captcha, onRefresh }: { captcha: string; onRefresh: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    ctx.clearRect(0, 0, width, height)

    const bgGradient = ctx.createLinearGradient(0, 0, width, height)
    bgGradient.addColorStop(0, '#f5f5f5')
    bgGradient.addColorStop(1, '#e8e8e8')
    ctx.fillStyle = bgGradient
    ctx.fillRect(0, 0, width, height)

    for (let i = 0; i < 4; i++) {
      ctx.beginPath()
      ctx.moveTo(Math.random() * width, Math.random() * height)
      ctx.bezierCurveTo(
        Math.random() * width,
        Math.random() * height,
        Math.random() * width,
        Math.random() * height,
        Math.random() * width,
        Math.random() * height
      )
      ctx.strokeStyle = `rgba(${Math.floor(Math.random() * 100)}, ${Math.floor(Math.random() * 100)}, ${Math.floor(Math.random() * 100)}, 0.3)`
      ctx.lineWidth = 1 + Math.random() * 2
      ctx.stroke()
    }

    for (let i = 0; i < 30; i++) {
      ctx.beginPath()
      ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 2, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${Math.floor(Math.random() * 150)}, ${Math.floor(Math.random() * 150)}, ${Math.floor(Math.random() * 150)}, 0.5)`
      ctx.fill()
    }

    const charWidth = width / captcha.length
    captcha.split('').forEach((char, index) => {
      const x = index * charWidth + charWidth / 2
      const y = height / 2 + Math.sin(index * 1.5) * 5

      ctx.save()
      ctx.translate(x, y)
      ctx.rotate((Math.random() - 0.5) * 0.5)
      
      const gradient = ctx.createLinearGradient(-20, -15, 20, 15)
      const colors = ['#333', '#666', '#999', '#000']
      gradient.addColorStop(0, colors[Math.floor(Math.random() * colors.length)])
      gradient.addColorStop(1, colors[Math.floor(Math.random() * colors.length)])
      
      ctx.font = `${24 + Math.random() * 8}px Arial Black, sans-serif`
      ctx.fillStyle = gradient
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      
      const offsetX = (Math.random() - 0.5) * 4
      const offsetY = (Math.random() - 0.5) * 4
      ctx.fillText(char, offsetX, offsetY)
      
      ctx.restore()
    })
  }, [captcha])

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={160}
        height={60}
        className="rounded-lg cursor-pointer"
        onClick={onRefresh}
      />
    </div>
  )
}

function LoginPage() {
  const [activeTab, setActiveTab] = useState('login')
  const [modalCaptcha, setModalCaptcha] = useState(generateCaptchaText())
  const [captchaInput, setCaptchaInput] = useState('')
  const [showCaptchaModal, setShowCaptchaModal] = useState(false)
  const [form] = Form.useForm()
  const { handleLogin, handleRegister } = useAuth()

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      if (activeTab === 'login') {
        await handleLogin(values.email, values.password)
      } else {
        await handleRegister(values.username, values.email, values.password)
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

  const handleConfirmCaptcha = () => {
    if (captchaInput.toLowerCase() === modalCaptcha.toLowerCase()) {
      form.setFieldsValue({ captcha: captchaInput })
      setShowCaptchaModal(false)
      setCaptchaInput('')
    } else {
      alert('验证码错误，请重新输入')
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
      <div className="absolute inset-0 bg-linear-to-tr from-cyan-400 via-teal-300 to-yellow-300 opacity-50" />

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
                    <Button icon={<img src={gitlabIcon} alt="GitLab" />}>
                      GitLab登录
                    </Button>
                    <Button icon={<img src={dingtalkIcon} alt="DingTalk" />}>
                      钉钉登录
                    </Button>
                    <Button icon={<img src={weixinIcon} alt="Weixin" />}>
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
                    <Button icon={<img src={gitlabIcon} alt="GitLab" />}>
                      GitLab登录
                    </Button>
                    <Button icon={<img src={dingtalkIcon} alt="DingTalk" />}>
                      钉钉登录
                    </Button>
                    <Button icon={<img src={weixinIcon} alt="Weixin" />}>
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