export type { User, LoginData, RegisterData, LoginResponse } from './user'
export type { MyDocument, ShareData, UploadProgress } from './file'

export type { AuditLog } from './audit'
export type { Group, GroupMember, GroupDocument } from './group'


export enum PermissionType {
    VIEW = 'view',
    DOWNLOAD = 'download',  
    EDIT = 'edit',
    DELETE = 'delete',
    COMMENT = 'comment',
    CHANGE_PERMISSION = 'change_permission',
    SHARE = 'share',
    MAKE_TEMPLATE = 'make_template',
}
export enum PermissionNumber{
    VIEW =             0x00000001,
    DOWNLOAD =         0x00000010,
    EDIT =             0x00000100,
    DELETE =           0x00001000,
    COMMENT =          0x00010000,
    CHANGE_PERMISSION =0x00100000,
    SHARE =            0x01000000,
    MAKE_TEMPLATE =    0x10000000,
}

export type Permission = PermissionType