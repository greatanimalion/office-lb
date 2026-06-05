/**
 * 传入字符串，转化为刚刚，一分钟前，一小时前，然后是具体时间xxxx-xx-xx xx:xx:xx
*/
export function formatDate(dateStr: string|Date): string {
  if (!dateStr) return ''
  
  const date = new Date(dateStr)
  
  if (isNaN(date.getTime())) {
    console.warn('Invalid date string:', dateStr)
    return dateStr.toString()
  }
  
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const diffInMinutes = diff / (1000 * 60)
  const diffInHours = diff / (1000 * 60 * 60)
  const diffInDays = diff / (1000 * 60 * 60 * 24)
  
  if (diffInMinutes < 1) {
    return '刚刚'
  }
  if (diffInHours < 1) {
    return `${Math.floor(diffInMinutes)}分钟前`
  }
  if (diffInDays < 1) {
    return `${Math.floor(diffInHours)}小时前`
  }
  
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}
