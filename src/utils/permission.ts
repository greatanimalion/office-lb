import { PermissionNumber, PermissionType, type Permission } from '../types'

/**
 * 将权限数组转换为二进制数
*/
export function permissonToBinary(
  permission: Permission[],
): number {
  let binary = 0x0000000
  for (let p of permission) {
    switch (p) {
      case PermissionType.VIEW:
        binary |= PermissionNumber.VIEW
        break
      case PermissionType.SHARE:
        binary |= PermissionNumber.SHARE
        break
      case PermissionType.DELETE:
        binary |= PermissionNumber.DELETE
        break;
      case PermissionType.MAKE_TEMPLATE:
        binary |= PermissionNumber.MAKE_TEMPLATE
        break;
      case PermissionType.COMMENT:
        binary |= PermissionNumber.COMMENT
        break;
      case PermissionType.CHANGE_PERMISSION:
        binary |= PermissionNumber.CHANGE_PERMISSION
        break;
      case PermissionType.DOWNLOAD:
        binary |= PermissionNumber.DOWNLOAD
        break;
      case PermissionType.EDIT:
        binary |= PermissionNumber.EDIT
        break;
    }
  }
  return binary
}
/**
 * 将二进制数转换为权限数组,如0x00000011转换为[VIEW,SHARE],
*/
export function binaryToPermisson(
  binary: number,
): Permission[] {
  const permission: Permission[] = []
  
  if (binary & PermissionNumber.VIEW) {
    permission.push(PermissionType.VIEW)
  }
  if (binary & PermissionNumber.DOWNLOAD) {
    permission.push(PermissionType.DOWNLOAD)
  }
  if (binary & PermissionNumber.EDIT) {
    permission.push(PermissionType.EDIT)
  }
  if (binary & PermissionNumber.DELETE) {
    permission.push(PermissionType.DELETE)
  }
  if (binary & PermissionNumber.COMMENT) {
    permission.push(PermissionType.COMMENT)
  }
  if (binary & PermissionNumber.CHANGE_PERMISSION) {
    permission.push(PermissionType.CHANGE_PERMISSION)
  }
  if (binary & PermissionNumber.SHARE) {
    permission.push(PermissionType.SHARE)
  }
  if (binary & PermissionNumber.MAKE_TEMPLATE) {
    permission.push(PermissionType.MAKE_TEMPLATE)
  }
  
  return permission
}
