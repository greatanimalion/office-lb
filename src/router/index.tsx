import { Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Spin } from 'antd'
import MainLayout from '../layouts/MainLayout'
import { publicRoutes, privateRoutes } from './routes'
import PrivateRoute from './PrivateRoute'
import useUserStore from '../store/useUserStore'

function Loading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Spin size="large" />
    </div>
  )
}

function AppRouter() {
  const { isAuthenticated } = useUserStore()

  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {publicRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}

        <Route element={<PrivateRoute />}>
          <Route element={<MainLayout />}>
            {privateRoutes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                index={route.isIndex}
                element={route.element}
              />
            ))}
          </Route>
        </Route>

        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? '/' : '/login'} replace />}
        />
      </Routes>
    </Suspense>
  )
}

export default AppRouter