import { Card, Tabs, Form, Input, Switch, Select, Button, Divider, Table, Tag } from 'antd'
import { DatabaseOutlined, CloudOutlined, LockOutlined, BellOutlined, SaveOutlined } from '@ant-design/icons'

const mockLogs = [
  { id: 1, time: '2024-01-15 10:30', type: '系统', message: '系统配置更新成功' },
  { id: 2, time: '2024-01-14 15:20', type: '数据库', message: '数据库备份完成' },
  { id: 3, time: '2024-01-13 09:15', type: '安全', message: '安全策略更新' },
]

const logColumns = [
  { title: '时间', dataIndex: 'time', key: 'time' },
  { title: '类型', dataIndex: 'type', key: 'type', render: (text: string) => <Tag color="blue">{text}</Tag> },
  { title: '消息', dataIndex: 'message', key: 'message' },
]

function SystemManagement() {
  const [form] = Form.useForm()

  const handleSave = () => {
    form.validateFields().then(() => {
      console.log('保存系统配置')
    })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold">系统管理</h2>
          <p className="text-gray-500">配置和管理系统参数</p>
        </div>
        <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>
          保存配置
        </Button>
      </div>

      <Tabs
        defaultActiveKey="basic"
        items={[
          {
            key: 'basic',
            label: '基本设置',
            icon: <DatabaseOutlined />,
            children: (
              <Card className="mt-4">
                <Form form={form} layout="vertical">
                  <div className="grid grid-cols-2 gap-6">
                    <Form.Item label="系统名称" name="systemName">
                      <Input defaultValue="OnlyOffice" />
                    </Form.Item>
                    <Form.Item label="系统版本" name="version">
                      <Input defaultValue="1.0.0" disabled />
                    </Form.Item>
                    <Form.Item label="系统描述" name="description">
                      <Input.TextArea rows={4} defaultValue="在线文档协作平台" />
                    </Form.Item>
                    <Form.Item label="管理员邮箱" name="adminEmail">
                      <Input defaultValue="admin@example.com" />
                    </Form.Item>
                  </div>
                </Form>
              </Card>
            ),
          },
          {
            key: 'security',
            label: '安全设置',
            icon: <LockOutlined />,
            children: (
              <Card className="mt-4">
                <Form form={form} layout="vertical">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <span>开启登录验证码</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <span>开启双因素认证</span>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <span>登录失败锁定</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <span>开启IP白名单</span>
                      <Switch />
                    </div>
                  </div>
                </Form>
              </Card>
            ),
          },
          {
            key: 'notification',
            label: '通知设置',
            icon: <BellOutlined />,
            children: (
              <Card className="mt-4">
                <Form form={form} layout="vertical">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <span>邮件通知</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <span>系统消息通知</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <span>文档更新通知</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <span>共享通知</span>
                      <Switch />
                    </div>
                  </div>
                </Form>
              </Card>
            ),
          },
          {
            key: 'storage',
            label: '存储设置',
            icon: <CloudOutlined />,
            children: (
              <Card className="mt-4">
                <Form form={form} layout="vertical">
                  <div className="grid grid-cols-2 gap-6">
                    <Form.Item label="存储类型" name="storageType">
                      <Select defaultValue="local" options={[
                        { value: 'local', label: '本地存储' },
                        { value: 'oss', label: '阿里云OSS' },
                        { value: 's3', label: 'AWS S3' },
                      ]} />
                    </Form.Item>
                    <Form.Item label="最大文件大小" name="maxFileSize">
                      <Input defaultValue="50MB" />
                    </Form.Item>
                    <Form.Item label="存储路径" name="storagePath">
                      <Input defaultValue="/data/storage" />
                    </Form.Item>
                    <Form.Item label="备份周期" name="backupCycle">
                      <Select defaultValue="daily" options={[
                        { value: 'daily', label: '每日备份' },
                        { value: 'weekly', label: '每周备份' },
                        { value: 'monthly', label: '每月备份' },
                      ]} />
                    </Form.Item>
                  </div>
                  <Divider />
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">当前存储使用</span>
                    <span className="text-blue-600">12.5 GB / 100 GB</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '12.5%' }}></div>
                  </div>
                </Form>
              </Card>
            ),
          },
          {
            key: 'logs',
            label: '系统日志',
            icon: <DatabaseOutlined />,
            children: (
              <Card className="mt-4">
                <Table
                  columns={logColumns}
                  dataSource={mockLogs}
                  rowKey="id"
                  pagination={false}
                />
              </Card>
            ),
          },
        ]}
      />
    </div>
  )
}

export default SystemManagement