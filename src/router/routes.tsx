
import { lazy } from 'react'

const Login = lazy(() => import('@/pages/Login'))
const Dashboard = lazy(() => import('@/pages/Dashboard'))
const FileManager = lazy(() => import('@/pages/FileManager'))
const InnerPreview = lazy(() => import('@/pages/FileManager/components/InnerPreview'))
const DocumentPreview = lazy(() => import('@/pages/DocumentPreview'))
const ShareLink = lazy(() => import('@/pages/ShareLink'))
const AuditLog = lazy(() => import('@/pages/AuditLog'))
const PermissionManage = lazy(() => import('@/pages/PermissionManage'))
const UserManage = lazy(() => import('@/pages/UserManage'))
const Workspace = lazy(() => import('@/pages/workspace'))
const Analysis = lazy(() => import('@/pages/Analysis'))
const Shared = lazy(() => import('@/pages/Shared'))
const SystemManagement = lazy(() => import('@/pages/SystemManagement'))
const ComponentCenter = lazy(() => import('@/pages/ComponentCenter'))
const TemplateCenter = lazy(() => import('@/pages/TemplateCenter'))
const ExceptionPage = lazy(() => import('@/pages/ExceptionPage'))
const HelpCenter = lazy(() => import('@/pages/HelpCenter'))
const UpdateLog = lazy(() => import('@/pages/UpdateLog'))
const NotFound = lazy(() => import('@/pages/NotFound'))

export interface RouteConfig {
  path: string
  element: React.ReactNode
  isIndex?: boolean
  isPublic?: boolean
  children?: RouteConfig[]
}

export const publicRoutes: RouteConfig[] = [
  { path: '/login/:token?', element: <Login />, isPublic: true },
  { path: '/s/:token', element: <ShareLink />, isPublic: true },
]

export const privateRoutes: RouteConfig[] = [
  { path: '/', element: <Dashboard />, isIndex: true },
  { path: '/files', element: <FileManager /> },
  { path: '/documents/:id/inner-preview', element: <InnerPreview /> },
  { path: '/documents/:id/preview', element: <DocumentPreview /> },
  { path: '/audit-log', element: <AuditLog /> },
  { path: '/permissions', element: <PermissionManage /> },
  { path: '/users', element: <UserManage /> },
  { path: '/workspace', element: <Workspace /> },
  { path: '/analysis', element: <Analysis /> },
  { path: '/shared', element: <Shared /> },
  { path: '/system-management', element: <SystemManagement /> },
  { path: '/component-center', element: <ComponentCenter /> },
  { path: '/template-center', element: <TemplateCenter /> },
  { path: '/exception-page', element: <ExceptionPage /> },
  { path: '/help-center', element: <HelpCenter /> },
  { path: '/update-log', element: <UpdateLog /> },
  { path: '*', element: <NotFound /> },
]