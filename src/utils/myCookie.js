export function setCookie(name, value, maxAge=0) {
  document.cookie = `${name}=${value}; max-age=${maxAge}`
}

export function deleteCookie(name) {
  document.cookie = `${name}=0; max-age=0`
}

export function getCookie(name='') {
  const arr = document.cookie.split('; ')
  let cookies = {}
  for (let i of arr) {
    const cookie = i.split('=')
    cookies[cookie[0]] = cookie[1]
  }
  if (name) return cookies[name]
  return cookies
}
