export default function add(a, b) {
  const aArr = a.split('').reverse().map(item => parseInt(item, 10))
  const bArr = b.split('').reverse().map(item => parseInt(item, 10))
  const c = []
  let rest = 0
  let i = 0
  for (;i < aArr.length || i < bArr.length ; i++) {
    let aNum = aArr[i] || 0
    let bNum = bArr[i] || 0
    let sum = aNum + bNum + rest
    c[i] = sum % 10
    rest = Math.floor(sum / 10)
  }
  if (rest) {
    c[++i] = rest
  }
  return c.reverse().join('')
}