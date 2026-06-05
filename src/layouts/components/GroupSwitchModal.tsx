import { Modal, Tabs, Card, Empty, Avatar, Tag } from 'antd'
import { CrownOutlined, PlusOutlined, TeamOutlined, CheckCircleOutlined } from '@ant-design/icons'
import type { Group } from '@/types'
import { useAuth } from '@/hooks/useAuth'
import useUserStore from '@/store/useUserStore'

interface GroupSwitchModalProps {
  open: boolean
  onClose: () => void
  createdGroups: Group[]
  joinedGroups: Group[]
  currentGroupId?: number
}

export function GroupSwitchModal({
  open,
  onClose,
  createdGroups,
  joinedGroups,
}: GroupSwitchModalProps) {
  const { handleChangeGroup } = useAuth()
  const onSelectGroup = (group: Group) => {
    handleChangeGroup(group.id)
  }
  const user = useUserStore(state => state.user)
  const renderGroupCard = (group: Group, isCreator: boolean) => {
    const isCurrentGroup = group.id === user?.group_id
    return (
      <Card
        key={group.id}
        hoverable
        className={`cursor-pointer mb-1!`}
        onClick={() => onSelectGroup(group)}
      >
        <div className="flex items-center justify-between -mt-2.5 -mb-2.5">
          <div className="flex items-center gap-3">
            <Avatar
              icon={<TeamOutlined />}
              className={`${isCreator ? 'bg-blue-500' : 'bg-gray-400'} ${isCurrentGroup ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
            />
            <div>
              <div className="font-medium flex items-center gap-2">
                {group.name}
                {isCurrentGroup && (
                  <Tag color="blue" icon={<CheckCircleOutlined />}>
                    当前
                  </Tag>
                )}
              </div>
              <div className="text-gray-400 text-sm">
                {isCreator ? '创建者' : '成员'}
              </div>
            </div>
          </div>
          <span className="text-gray-400 text-sm">{group.memberCount} 成员</span>
        </div>
      </Card>
    )
  }

  return (
    <Modal
      title="切换组"
      open={open}
      onCancel={onClose}
      footer={null}
      width={500}
    >
      <Tabs
        items={[
          {
            key: 'created',
            label: (
              <div className="flex items-center gap-2">
                <CrownOutlined className="text-yellow-500" />
                <span>创建的组</span>
                <span className="text-gray-400 text-sm">({createdGroups.length})</span>
              </div>
            ),
            children: createdGroups.length === 0 ? (
              <Empty description="暂无创建的组" />
            ) : (
              <div className="space-y-2 mt-2 ">
                {createdGroups.map(group => renderGroupCard(group, true))}
              </div>
            ),
          },
          {
            key: 'joined',
            label: (
              <div className="flex items-center gap-2">
                <PlusOutlined className="text-green-500" />
                <span>加入的组</span>
                <span className="text-gray-400 text-sm">({joinedGroups.length})</span>
              </div>
            ),
            children: joinedGroups.length === 0 ? (
              <Empty description="暂无加入的组" />
            ) : (
              <div className="space-y-2 mt-2">
                {joinedGroups.map(group => renderGroupCard(group, false))}
              </div>
            ),
          },
        ]}
      />
    </Modal>
  )
}
