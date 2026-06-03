
import { Outlet } from 'react-router-dom'

function PreviewLayout() {
  return (
    <div className="w-screen h-screen">
      <Outlet />
    </div>
  )
}

export default PreviewLayout
