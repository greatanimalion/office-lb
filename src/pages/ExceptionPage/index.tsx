import { Card, Tabs, Table, Tag, Button, Empty, Row, Col } from 'antd'
import { WarningOutlined, BugOutlined, ClockCircleOutlined, RestOutlined, FileTextOutlined, ExclamationCircleOutlined } from '@ant-design/icons'

const mockExceptions = [
  { id: 1, code: '404', message: '页面未找到', path: '/page-not-found', time: '2024-01-15 10:30', count: 5 },
  { id: 2, code: '500', message: '服务器内部错误', path: '/api/users', time: '2024-01-14 15:20', count: 2 },
  { id: 3, code: '403', message: '权限不足', path: '/admin/dashboard', time: '2024-01-13 09:15', count: 8 },
]

const mockLogs = [
  { id: 1, level: 'error', message: '数据库连接失败', time: '2024-01-15 10:30', source: 'database' },
  { id: 2, level: 'warn', message: '内存使用超过80%', time: '2024-01-14 15:20', source: 'system' },
  { id: 3, level: 'error', message: 'API调用超时', time: '2024-01-13 09:15', source: 'api' },
]

const exceptionColumns = [
  { title: '错误码', dataIndex: 'code', key: 'code', render: (text: string) => <Tag color="red">{text}</Tag> },
  { title: '错误信息', dataIndex: 'message', key: 'message' },
  { title: '路径', dataIndex: 'path', key: 'path' },
  { title: '发生时间', dataIndex: 'time', key: 'time' },
  { title: '发生次数', dataIndex: 'count', key: 'count', render: (text: number) => <Tag color="orange">{text}次</Tag> },
]

const logColumns = [
  { title: '级别', dataIndex: 'level', key: 'level', render: (text: string) => <Tag color={text === 'error' ? 'red' : 'orange'}>{text}</Tag> },
  { title: '消息', dataIndex: 'message', key: 'message' },
  { title: '来源', dataIndex: 'source', key: 'source' },
  { title: '时间', dataIndex: 'time', key: 'time' },
]

function ExceptionPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold">异常页面</h2>
          <p className="text-gray-500">查看和管理系统异常</p>
        </div>
        <Button type="primary" icon={<RestOutlined />}>
          刷新
        </Button>
      </div>

      <Row gutter={16} className="mb-6">
        <Col span={6}>
          <Card>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                <ExclamationCircleOutlined className="text-red-500" />
              </div>
              <div>
                <div className="text-2xl font-bold text-red-500">3</div>
                <div className="text-sm text-gray-500">错误数量</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                <WarningOutlined className="text-orange-500" />
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-500">5</div>
                <div className="text-sm text-gray-500">警告数量</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <BugOutlined className="text-blue-500" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-500">2</div>
                <div className="text-sm text-gray-500">Bug数量</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center">
                <ClockCircleOutlined className="text-gray-500" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-500">15</div>
                <div className="text-sm text-gray-500">总异常数</div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Tabs
        defaultActiveKey="exceptions"
        items={[
          {
            key: 'exceptions',
            label: '异常列表',
            icon: <ExclamationCircleOutlined />,
            children: (
              <Card>
                <Table
                  columns={exceptionColumns}
                  dataSource={mockExceptions}
                  rowKey="id"
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total) => `共 ${total} 条记录`,
                  }}
                />
              </Card>
            ),
          },
          {
            key: 'logs',
            label: '日志记录',
            icon: <FileTextOutlined />,
            children: (
              <Card>
                <Table
                  columns={logColumns}
                  dataSource={mockLogs}
                  rowKey="id"
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total) => `共 ${total} 条记录`,
                  }}
                />
              </Card>
            ),
          },
          {
            key: 'details',
            label: '错误详情',
            icon: <BugOutlined />,
            children: (
              <Card>
                <Empty description="请选择一个异常查看详情" />
              </Card>
            ),
          },
        ]}
      />
    </div>
  )
}

export default ExceptionPage