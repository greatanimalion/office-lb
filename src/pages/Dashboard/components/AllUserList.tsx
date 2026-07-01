import { useState, useEffect } from 'react'
import { Card, Avatar } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { formatDate } from '@/utils/day'
import { authAPI } from '@/services/api/auth'
import type { OnlineUser } from '@/types/user'
import useUserStore from '@/store/useUserStore'

function AllUserList() {
    const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([])
    const user = useUserStore((state) => state.user)
    useEffect(() => {
        authAPI.getAllUser().then(res => {
            if (res.data.success) {
                setOnlineUsers(res.data.user || [])
            }
        })
       
    }, [])
    return (
        <Card title="人员列表" className="shrink-0" style={{ width: 350 }}>
            <div className="space-y-3">
                {onlineUsers.map((u) => (
                    <div
                        key={u.id}
                        className="flex items-center gap-3 p-3  rounded-lg  transition-colors"
                    >
                        <Avatar
                            src={u.avatar}
                            icon={<UserOutlined />}
                        />
                        <div className="flex-1">
                            <div className="font-medium  flex  gap-1 items-center">
                                {user.id == u.id ? <div className={`w-2 h-2   rounded-full bg-green-500`} /> : null}
                                {u.username}({u.email || (u.provider + "登录")})</div>
                            <div className="flex items-center gap-1">
                                {/* <span className={`w-2 h-2 rounded-full ${user.online ? 'bg-green-500' : 'bg-gray-400'}`} /> */}
                                {/* <span className={`text-sm ${user.online ? 'text-green-500' : 'text-gray-400'}`}>
                        {user.online ? '在线' : '离线'}
                      </span> */}
                                <span className={`text-sm `}>上次登录时间：{formatDate(u.last_login_at)}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    )
}

export default AllUserList
