export const isPhone = v => {
  let re = /[(][0-9]{3}[)]\s[0-9]{3}[-][0-9]{2}[-][0-9]{2}/
  re.lastIndex = 0
  return re.test(v)
}

export const isPassword = v => {
  let re = /\s/
  re.lastIndex = 0
  return !re.test(v)
}


