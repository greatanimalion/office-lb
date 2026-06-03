import { Layout, Menu, Button, Avatar, Input, Dropdown, Badge, theme as antdTheme, ConfigProvider, } from 'antd'
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
  AppstoreOutlined,
  LayoutOutlined,
  DatabaseOutlined,
  BarChartOutlined,
  UpCircleOutlined,
  FileSearchOutlined,
  WarningOutlined,
  BgColorsOutlined,
  SunOutlined,
  MoonOutlined,
  SyncOutlined
} from '@ant-design/icons'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import useUserStore from '../store/useUserStore'
import useGlobalStore from '../store/useGlobalStore'
import logo from '@/assets/images/office.png'
import { useTheme } from '@/hooks/useTheme'
const { Header, Content, Sider } = Layout
const { Search } = Input

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
  const { mode, effectiveTheme, changeMode } = useTheme();
  const getAlgorithm = () => {
    return effectiveTheme === 'dark'
      ? antdTheme.darkAlgorithm
      : antdTheme.defaultAlgorithm;
  };
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
  const themeMenuItems = [
    { key: 'light',onClick:()=>changeMode('light'), icon: <SunOutlined />, label: '浅色主题', extra: <div  className={`w-1 h-1 rounded-2xl ${mode=='light'?'bg-blue-600':''}`}></div> },
    { key: 'dark',onClick:()=>changeMode('dark'), icon: <MoonOutlined />, label: '暗色主题', extra: <div className={`w-1 h-1 rounded-2xl ${mode=='dark'?'bg-blue-600':''}`}></div> },
    { type: 'divider' as const },
    { key: 'auto',onClick:()=>changeMode('system'), icon: <SyncOutlined />, label: '跟随系统', extra:<div className={`w-1 h-1 rounded-2xl ${mode=='system'?'bg-blue-600':''}`}></div> },
  ]
  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: '仪表盘',
      onClick: () => navigate('/'),
    },
    {
      key: '/workspace',
      icon: <AppstoreOutlined />,
      label: '工作台',
      onClick: () => navigate('/workspace'),
    },
    {
      key: '/analysis',
      icon: <BarChartOutlined />,
      label: '分析台',
      onClick: () => navigate('/analysis'),
    },
    {
      key: 'documents',
      icon: <FileTextOutlined />,
      label: '文档管理',
      children: [
        { key: '/files', icon: <FileTextOutlined />, label: '文档列表', onClick: () => navigate('/files') },
        { key: '/shared', icon: <ShareAltOutlined />, label: '共享文档', onClick: () => navigate('/shared') },
      ],
    },
    {
      key: 'system',
      icon: <LayoutOutlined />,
      label: '系统中心',
      children: [
        { key: '/system-management', icon: <DatabaseOutlined />, label: '系统管理', onClick: () => navigate('/system-management') },
        { key: '/component-center', icon: <AppstoreOutlined />, label: '组件中心', onClick: () => navigate('/component-center') },
        { key: '/template-center', icon: <FileSearchOutlined />, label: '模板中心', onClick: () => navigate('/template-center') },
      ],
    },
    {
      key: 'admin',
      icon: <SafetyOutlined />,
      label: '管理中心',
      children: [
        { key: '/permissions', icon: <SafetyOutlined />, label: '权限管理', onClick: () => navigate('/permissions') },
        { key: '/users', icon: <TeamOutlined />, label: '用户管理', onClick: () => navigate('/users') },
        { key: '/audit-log', icon: <AuditOutlined />, label: '审计日志', onClick: () => navigate('/audit-log') },
      ],
    },
    {
      key: 'monitor',
      icon: <WarningOutlined />,
      label: '异常页面',
      children: [
        { key: '/exception-page', icon: <WarningOutlined />, label: '异常页面', onClick: () => navigate('/exception-page') },
      ],
    },
    {
      key: 'help',
      icon: <UpCircleOutlined />,
      label: '帮助中心',
      badge: { dot: true },
      children: [
        { key: '/help-center', icon: <UpCircleOutlined />, label: '帮助中心', onClick: () => navigate('/help-center') },
        { key: '/update-log', icon: <FileTextOutlined />, label: '更新日志', onClick: () => navigate('/update-log') },
      ],
    },
  ]

  return (
    <ConfigProvider
      theme={{
        algorithm: getAlgorithm(),
        components: {
        Layout: {
          headerBg: effectiveTheme=="dark" ? '#141414' : '#ffffff', // 暗色模式常用背景色，亮色模式白色
        },
      },token: {
          colorPrimary: '#f5222d',
        },
      }}
    >
      <Layout style={{ height: '100vh', overflow: 'hidden'}} >
        <Header
          className="flex items-center justify-between h-16 p-4!"
         >
          <div className="flex items-center justify-center h-16">
            <img src={logo} alt="logo" className="w-8 h-8 mr-2" />
            <span className="text-lg font-bold">OnlyOffice</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2  ">
              <span className="  font-medium text-lg">{getGreeting()}</span>
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
            <Badge offset={[-5, 5]} size="small" count={3}>
              <Button type='text' icon={<MailOutlined />}></Button>
            </Badge>
            <Badge offset={[-5, 5]} size="small" count={3}>
              <Button type='text' icon={<MessageOutlined />}></Button>
            </Badge>
            <Badge offset={[-5, 5]} size="small" count={3}>
              <Button type='text' icon={<BellOutlined />}></Button>
            </Badge>
            <Dropdown menu={{ items: themeMenuItems }} placement='bottom'>
              <Button type="text" icon={<BgColorsOutlined />} />
            </Dropdown>
            <Dropdown menu={{ items: userMenuItems }} trigger={['hover', 'click']}>
              <div className="flex items-center gap-2 cursor-pointer px-2 py-1 rounded-lg transition-colors">
                <Avatar size={32} icon={<UserOutlined />} className="bg-blue-500" />
                <span className="text-sm text-gray-700">{user?.username}</span>
              </div>
            </Dropdown>
          </div>
        </Header>
        <Layout>
          <Sider
            width={200}
            theme="light"
            collapsible
            collapsed={sidebarCollapsed}
            onCollapse={toggleSidebar}
            style={{ overflow: 'auto' }}
            className='scrollbar'
          >
            <Menu
              mode="inline"
              selectedKeys={[location.pathname]}
              theme="light"
              defaultOpenKeys={['documents', 'system', 'admin']}
              items={menuItems}
            />
          </Sider>
          <Content className="p-6">
            <Outlet />
          </Content>
        </Layout>
      </Layout >
    </ConfigProvider>
  )
}

export default MainLayout