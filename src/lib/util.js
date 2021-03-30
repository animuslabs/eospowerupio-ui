export function validateName(name){
  const validRegex = new RegExp('(^[a-z1-5.]{0,11}[a-z1-5]$)|(^[a-z1-5.]{12}[a-j1-5]$)')
  if (typeof name !== 'string') return false
  if (!validRegex.test(name)) return false
  return true
}