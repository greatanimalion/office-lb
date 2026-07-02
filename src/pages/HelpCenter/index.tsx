import { Card, Row, Col, Input, Tag, Tabs } from 'antd'
import { UpCircleOutlined, SearchOutlined, FileTextOutlined, MessageOutlined, VideoCameraOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons'

const { Search } = Input

const mockFAQs = [
  { id: 1, question: '如何上传文档？', answer: '登录后进入文档管理页面，点击上传按钮选择文件即可上传。', category: '文档操作' },
  { id: 2, question: '如何共享文档？', answer: '在文档列表中点击共享按钮，输入共享用户的邮箱地址即可。', category: '文档操作' },
  { id: 3, question: '如何创建组？', answer: '进入工作台页面，点击创建组按钮，填写组信息即可。', category: '组管理' },
  { id: 4, question: '如何找回密码？', answer: '在登录页面点击忘记密码，输入邮箱地址即可重置密码。', category: '账号安全' },
]

const mockDocs = [
  { id: 1, title: '快速入门指南', description: '帮助您快速了解系统功能', category: '入门' },
  { id: 2, title: '文档管理教程', description: '详细介绍文档上传、编辑、共享等操作', category: '文档' },
  { id: 3, title: '组管理教程', description: '介绍如何创建和管理组', category: '组' },
  { id: 4, title: '权限设置说明', description: '详细说明各种权限设置', category: '权限' },
]

function HelpCenter() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold">帮助中心</h2>
          <p className="text-gray-500">获取帮助和支持</p>
        </div>
      </div>

      <Card className="mb-6">
        <div className="flex items-center gap-4">
          <Search
            placeholder="搜索帮助文档..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            style={{ flex: 1 }}
          />
        </div>
      </Card>

      <Row gutter={16} className="mb-6">
        <Col span={6}>
          <Card hoverable className="text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileTextOutlined className="text-blue-500 text-2xl" />
            </div>
            <h3 className="font-medium mb-2">帮助文档</h3>
            <p className="text-gray-500 text-sm">查看详细的使用教程</p>
          </Card>
        </Col>
        <Col span={6}>
          <Card hoverable className="text-center">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <VideoCameraOutlined className="text-green-500 text-2xl" />
            </div>
            <h3 className="font-medium mb-2">视频教程</h3>
            <p className="text-gray-500 text-sm">观看操作演示视频</p>
          </Card>
        </Col>
        <Col span={6}>
          <Card hoverable className="text-center">
            <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageOutlined className="text-orange-500 text-2xl" />
            </div>
            <h3 className="font-medium mb-2">在线客服</h3>
            <p className="text-gray-500 text-sm">与客服人员在线交流</p>
          </Card>
        </Col>
        <Col span={6}>
          <Card hoverable className="text-center">
            <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <PhoneOutlined className="text-purple-500 text-2xl" />
            </div>
            <h3 className="font-medium mb-2">联系我们</h3>
            <p className="text-gray-500 text-sm">获取技术支持</p>
          </Card>
        </Col>
      </Row>

      <Tabs
        defaultActiveKey="faq"
        items={[
          {
            key: 'faq',
            label: '常见问题',
            icon: <UpCircleOutlined />,
            children: (
              <Card className="mt-4">
                <div className="flex gap-4 mb-6">
                  <Tag color="blue">全部</Tag>
                  <Tag>文档操作</Tag>
                  <Tag>组管理</Tag>
                  <Tag>账号安全</Tag>
                </div>
                <div className="space-y-4">
                  {mockFAQs.map((faq) => (
                    <div key={faq.id} className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-medium mb-2">{faq.question}</h3>
                      <p className="text-gray-500">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </Card>
            ),
          },
          {
            key: 'docs',
            label: '帮助文档',
            icon: <FileTextOutlined />,
            children: (
              <Card className="mt-4">
                <div className="flex gap-4 mb-6">
                  <Tag color="blue">全部</Tag>
                  <Tag>入门</Tag>
                  <Tag>文档</Tag>
                  <Tag>组</Tag>
                  <Tag>权限</Tag>
                </div>
                <Row gutter={16}>
                  {mockDocs.map((doc) => (
                    <Col span={12} key={doc.id}>
                      <Card hoverable className="mb-4">
                        <h3 className="font-medium mb-2">{doc.title}</h3>
                        <p className="text-gray-500 text-sm">{doc.description}</p>
                        <Tag color="blue" className="mt-2">{doc.category}</Tag>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Card>
            ),
          },
          {
            key: 'contact',
            label: '联系支持',
            icon: <MailOutlined />,
            children: (
              <Card className="mt-4">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                      <MailOutlined className="text-blue-500" />
                    </div>
                    <div>
                      <h3 className="font-medium">邮箱支持</h3>
                      <p className="text-gray-500">support@example.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                      <PhoneOutlined className="text-green-500" />
                    </div>
                    <div>
                      <h3 className="font-medium">电话支持</h3>
                      <p className="text-gray-500">400-123-4567</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                      <MessageOutlined className="text-orange-500" />
                    </div>
                    <div>
                      <h3 className="font-medium">在线聊天</h3>
                      <p className="text-gray-500">周一至周五 9:00-18:00</p>
                    </div>
                  </div>
                </div>
              </Card>
            ),
          },
        ]}
      />
    </div>
  )
}

export default HelpCenter