export type { User, LoginData, RegisterData, LoginResponse } from './user'
export type { MyDocument, ShareData, UploadProgress } from './file'

export type { AuditLog } from './audit'
export type { Group, GroupMember } from './group'
export type { PermissionRule, RolePermission } from './permission'


export enum PermissionType {
    VIEW = 'view',
    DOWNLOAD = 'download',  
    EDIT = 'edit',
    DELETE = 'delete',
    COMMENT = 'comment',
    CHANGE_PERMISSION = 'change_permission',
    SHARE = 'share',
    MAKE_TEMPLATE = 'make_template',
    UPLOAD_FILE = 'upload_file',
}
export enum PermissionNumber{
    VIEW =             0b000000001,
    DOWNLOAD =         0b000000010,
    EDIT =             0b000000100,
    DELETE =           0b000001000,
    COMMENT =          0b000010000,
    CHANGE_PERMISSION =0b000100000,
    SHARE =            0b001000000,
    MAKE_TEMPLATE =    0b010000000,
    UPLOAD_FILE =      0b100000000,
}

export type Permission = PermissionType