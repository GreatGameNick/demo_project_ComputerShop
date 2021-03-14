import axios from "axios";
import {Identification, Authentication} from '@/types/auth'

export const isPhone = (v: string): boolean => {
  let re = /[(][0-9]{3}[)]\s[0-9]{3}[-][0-9]{2}[-][0-9]{2}/
  re.lastIndex = 0
  return re.test(v)
}

export const isPassword = (v: string): boolean => {
  let re = /\s/
  re.lastIndex = 0
  return !re.test(v)
}

export const isUnique = async (login: Identification): Promise<boolean> => {
  let isLogin: boolean = false
  if(login) {
    await axios.get(`api/identification/${login}`)
      .then(({data}) => {
        console.log('==== identification----VUE', data.isLogin)
        isLogin = data.isLogin
      })
  }
  return Promise.resolve(isLogin)
}
