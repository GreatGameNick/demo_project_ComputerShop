const isPhone = v => /[(][0-9]{3}[)]\s[0-9]{3}[-][0-9]{2}[-][0-9]{2}/.test(v)
export default isPhone
