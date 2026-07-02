import { Modal, Switch, message } from 'antd'
import type { MyDocument } from '@/types/file'

interface TemplateSettingsModalProps {
  open: boolean
  doc: MyDocument | null
  onCancel: () => void
}

export function TemplateSettingsModal({ open, doc, onCancel }: TemplateSettingsModalProps) {
  const handleSave = () => {
    message.success('模板设置已保存')
    onCancel()
  }

  return (
    <Modal
      title={`模板设置 - ${doc?.title || ''}`}
      open={open}
      onOk={handleSave}
      onCancel={onCancel}
      okText="保存"
      cancelText="取消"
      width={560}
    >
      <div className="mt-2">
        <div className="flex items-center gap-2 mb-4 text-base">
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4  rounded-lg">
            <div>
              <div className="font-medium">设为模板</div>
              <div className="text-sm text-gray-500">将当前文档添加到模板中心</div>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between p-4  rounded-lg">
            <div>
              <div className="font-medium">公开模板</div>
              <div className="text-sm text-gray-500">允许其他用户使用此模板</div>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between p-4  rounded-lg">
            <div>
              <div className="font-medium">自动更新</div>
              <div className="text-sm text-gray-500">模板内容随文档更新而更新</div>
            </div>
            <Switch />
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default TemplateSettingsModal
