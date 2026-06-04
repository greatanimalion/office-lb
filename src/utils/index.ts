
//将非中文字符串转化为base64
export function toBase64(str: string) {
    const buffer = new TextEncoder().encode(str)
    return btoa(unescape(encodeURIComponent(String.fromCharCode.apply(null, Array.from(new Uint8Array(buffer))))))
}