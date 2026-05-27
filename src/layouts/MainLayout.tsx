import { Layout, Menu, Button } from 'antd'
import { FileTextOutlined, ShareAltOutlined, LogoutOutlined, UserOutlined, DashboardOutlined, AuditOutlined, TeamOutlined, SafetyOutlined } from '@ant-design/icons'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import useUserStore from '../store/useUserStore'
import useGlobalStore from '../store/useGlobalStore'

const { Header, Content, Sider } = Layout

function MainLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useUserStore()
  const { sidebarCollapsed, toggleSidebar } = useGlobalStore()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const menuItems = [
    { key: '/', icon: <DashboardOutlined />, label: '仪表盘' },
    { key: '/files', icon: <FileTextOutlined />, label: '文档管理' },
    { key: '/shared', icon: <ShareAltOutlined />, label: '共享文档' },
    { key: '/audit-log', icon: <AuditOutlined />, label: '审计日志' },
    { key: '/permissions', icon: <SafetyOutlined />, label: '权限管理' },
    { key: '/users', icon: <TeamOutlined />, label: '用户管理' },
  ]

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header className="bg-blue-600 flex items-center justify-between px-6">
        <div className="text-white text-xl font-bold">OnlyOffice 文档管理</div>
        <div className="flex items-center gap-4">
          <span className="text-white flex items-center gap-2">
            <UserOutlined />
            {user?.username}
          </span>
          <Button onClick={handleLogout} danger>
            <LogoutOutlined />
            退出登录
          </Button>
        </div>
      </Header>
      <Layout>
        <Sider width={200} className="bg-gray-50" collapsible collapsed={sidebarCollapsed} onCollapse={toggleSidebar}>
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            onClick={({ key }) => navigate(key)}
            style={{ height: '100%', borderRight: 0 }}
            items={menuItems}
          />
        </Sider>
        <Layout style={{ padding: '24px' }}>
          <Content className="bg-white rounded-lg shadow p-6">
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  )
}

export default MainLayout