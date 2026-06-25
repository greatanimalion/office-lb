import { PermissionType } from "@/types"
import { DeleteOutlined, DownloadOutlined, EditOutlined, EyeOutlined, HistoryOutlined, LockOutlined, SafetyOutlined, ShareAltOutlined } from "@ant-design/icons"
import { Tag } from "antd"

export const getPermissionIcon = (p:PermissionType) => {
 switch (p) {
  case PermissionType.VIEW:
    return <Tag color="blue"><div className="btn_icon"><EyeOutlined />可读</div></Tag>
  case PermissionType.DOWNLOAD:
    return <Tag color="green"><div className="btn_icon"><DownloadOutlined />可下载</div></Tag>
  case PermissionType.EDIT:
    return <Tag color="orange"><div className="btn_icon"><EditOutlined />可编辑</div></Tag>
  case PermissionType.DELETE:
    return <Tag color="red"><div className="btn_icon"><DeleteOutlined />可删除</div></Tag>
     case PermissionType.SHARE:
    return <Tag color="purple"><div className="btn_icon"><ShareAltOutlined />可分享</div></Tag>
  case PermissionType.MAKE_TEMPLATE:
    return <Tag color="purple"><div className="btn_icon"><SafetyOutlined />可设为模板</div></Tag>
  case PermissionType.COMMENT:
    return <Tag color="blue"><div className="btn_icon"><HistoryOutlined />可评论</div></Tag>
  case PermissionType.CHANGE_PERMISSION:
    return <Tag color="purple"><div className="btn_icon"><LockOutlined />可修改权限</div></Tag>
 
  default:
    return null
 }
}