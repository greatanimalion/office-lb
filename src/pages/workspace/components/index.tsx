import { useState } from 'react'
import { Button, Tabs } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import useGroupStore from '@/store/useGroupStore'
import { GroupFiles } from './GroupFiles'
import { GroupMembers } from './GroupMembers'

interface GroupDetailProps {
  groupId: number
  onBack: () => void
}

export function GroupDetail({ groupId, onBack }: GroupDetailProps) {
  const { currentGroup,clearPathFolder } = useGroupStore()
  const [activeTab, setActiveTab] = useState('files')
  return (
    <div className="h-full flex flex-col">
        <div className="flex   justify-between">
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={()=>{onBack();clearPathFolder()}}
          >
            返回
          </Button>
          <div>  
            <h2 className="text-xl font-bold mb-1 text-right">
              {currentGroup?.name || '组详情'}
            </h2>
            <p className="text-gray-500 text-sm">
              {activeTab === 'files' ? '查看组内所有成员上传的文件' : '管理组成员'}
            </p>
          </div>
      </div>

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: 'files',
              label: '组内文件',
              children: <GroupFiles groupId={groupId} />,
            },
            {
              key: 'members',
              label: '组成员',
              children: <GroupMembers groupId={groupId} />,
            }
          ]}
        />
    </div>
  )
}

