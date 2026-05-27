import { Layout, Menu, Button, Avatar, Input, Dropdown, Badge } from 'antd'
import {
  FileTextOutlined,
  ShareAltOutlined,
  LogoutOutlined,
  UserOutlined,
  DashboardOutlined,
  AuditOutlined,
  TeamOutlined,
  SafetyOutlined,
  SearchOutlined,
  BellOutlined,
  SettingOutlined,
  MailOutlined,
  MessageOutlined,
  RightOutlined,
  DownOutlined,
  AppstoreOutlined,
  LayoutOutlined,
  DatabaseOutlined,
  BarChartOutlined,
  LeftCircleOutlined,
  UpCircleOutlined,
  FileSearchOutlined
} from '@ant-design/icons'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import useUserStore from '../store/useUserStore'
import useGlobalStore from '../store/useGlobalStore'
import logo from '@/assets/images/office.png'
const { Header, Content, Sider } = Layout
const { SubMenu, Item: MenuItem } = Menu
const { Search } = Input
const menuItems = [
  {
    key: 'dashboard',
    icon: <DashboardOutlined />,
    label: '仪表盘',
    path: '/',
  },
  {
    key: 'workspace',
    icon: <AppstoreOutlined />,
    label: '工作台',
    path: '/workspace',
  },
  {
    key: 'analysis',
    icon: <BarChartOutlined />,
    label: '分析台',
    path: '/analysis',
  },
  {
    key: 'documents',
    icon: <FileTextOutlined />,
    label: '文档管理',
    children: [
      { key: '/files', icon: <FileTextOutlined />, label: '文档列表', path: '/files' },
      { key: '/shared', icon: <ShareAltOutlined />, label: '共享文档', path: '/shared' },
    ],
  },
  {
    key: 'system',
    icon: <LayoutOutlined />,
    label: '系统中心',
    children: [
      { key: '/system-management', icon: <DatabaseOutlined />, label: '系统管理', path: '/system-management' },
      { key: '/component-center', icon: <AppstoreOutlined />, label: '组件中心', path: '/component-center' },
      { key: '/template-center', icon: <FileSearchOutlined />, label: '模板中心', path: '/template-center' },
    ],
  },
  {
    key: 'admin',
    icon: <SafetyOutlined />,
    label: '管理中心',
    children: [
      { key: '/permissions', icon: <SafetyOutlined />, label: '权限管理', path: '/permissions' },
      { key: '/users', icon: <TeamOutlined />, label: '用户管理', path: '/users' },
      { key: '/audit-log', icon: <AuditOutlined />, label: '审计日志', path: '/audit-log' },
    ],
  },
  {
    key: 'monitor',
    icon: <LeftCircleOutlined />,
    label: '异常页面',
    children: [
      { key: '/exception-page', icon: <LeftCircleOutlined />, label: '异常页面', path: '/exception-page' },
    ],
  },
  {
    key: 'help',
    icon: <UpCircleOutlined />,
    label: '帮助中心',
    children: [
      { key: '/help-center', icon: <UpCircleOutlined />, label: '帮助中心', path: '/help-center' },
      { key: '/update-log', icon: <FileTextOutlined />, label: '更新日志', path: '/update-log' },
    ],
  },
]
function getGreeting() {
  const now = new Date()
  const hour = now.getHours()
  if (hour < 12) {
    return '早上好!'
  } else if (hour < 18) {
    return '下午好!'
  } else {
    return '晚上好!'  
  }
}
function MainLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useUserStore()
  const { sidebarCollapsed, toggleSidebar } = useGlobalStore()
  const handleLogout = () => {
    logout()
    navigate('/login')
  }
  const userMenuItems = [
    { key: 'profile', icon: <UserOutlined />, label: '个人中心' },
    { key: 'settings', icon: <SettingOutlined />, label: '设置' },
    { type: 'divider' as const },
    { key: 'logout', icon: <LogoutOutlined />, label: '退出登录', onClick: handleLogout },
  ]
  const renderMenu = (items: any[]) => {
    return items.map((item) => {
      if (item.children) {
        const isActive = item.children.some((child: any) => location.pathname === child.path)
        return (
          <SubMenu
            key={item.key}
            icon={item.icon}
            title={
              <span>
                <span>{item.label}</span>
                {item.key === 'help' && (
                  <Badge dot className="ml-auto" />
                )}
              </span>
            }
            className={isActive ? 'ant-menu-item-selected' : ''}
          >
            {item.children.map((child: any) => (
              <MenuItem
                key={child.key}
                icon={child.icon}
                onClick={() => navigate(child.path)}
                className={location.pathname === child.path ? 'ant-menu-item-selected' : ''}
              >
                {child.label}
              </MenuItem>
            ))}
          </SubMenu>
        )
      }
      return (
        <MenuItem
          key={item.key}
          icon={item.icon}
          onClick={() => navigate(item.path)}
          className={location.pathname === item.path ? 'ant-menu-item-selected' : ''}
        >
          {item.label}
        </MenuItem>
      )
    })
  }
  return (
    <Layout style={{ minHeight: '100vh', background: 'white' }}>
      <Sider
        width={200}
        className="bg-white! border-right border-gray-200"
        collapsible
        collapsed={sidebarCollapsed}
        onCollapse={toggleSidebar}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 100,
        }}
      >
        <div className="flex items-center justify-center h-16 border-b border-gray-200">
          <img src={logo} alt="logo" className="w-8 h-8 mr-2" />
          {!sidebarCollapsed && <span className="text-lg font-bold=">OnlyOffic</span>}
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}

          style={{ height: 'calc(100% - 64px)', borderRight: 0 }}
          defaultOpenKeys={['documents', 'system', 'admin']}
        >
          {renderMenu(menuItems)}
        </Menu>
      </Sider>

      <Layout style={{ marginLeft: sidebarCollapsed ? 80 : 200, transition: 'margin-left 0.2s' }}>
        <Header
          className="bg-white! border-bottom border-gray-200 px-6 flex items-center justify-between"
          style={{ padding: '0 24px', height: 64, lineHeight: '64px' }}
        >
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-gray-600">
              <span className="text-gray-800 font-medium text-lg">{getGreeting()}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Search
              placeholder="搜索..."
              allowClear
              enterButton={<SearchOutlined />}
              style={{ width: 280 }}
              size="middle"
            />

            <Button type="text" className='' icon={<MailOutlined />}>
              <Badge count={3} />
            </Button>

            <Button type="text" icon={<MessageOutlined />}>
              <Badge count={5} />
            </Button>

            <Button type="text" icon={<BellOutlined />}>
              <Badge count={2} />
            </Button>

            <Button type="text" icon={<SettingOutlined />} />

            <Dropdown menu={{ items: userMenuItems }} trigger={['click']}>
              <div className="flex items-center gap-2 cursor-pointer px-2 py-1 hover:bg-gray-100 rounded-lg transition-colors">
                <Avatar size={32} icon={<UserOutlined />} className="bg-blue-500" />
                <span className="text-sm text-gray-700">{user?.username}</span>
                <DownOutlined className="text-gray-400" />
              </div>
            </Dropdown>
          </div>
        </Header>

        <Content className="p-6">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default MainLayout