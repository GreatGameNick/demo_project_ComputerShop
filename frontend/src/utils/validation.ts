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

export const isUnique = (isRegistrationInterface: boolean) => async (login: Identification): Promise<boolean> => {
  let isLogin: boolean = false
  
  if(login) {     //при пустом поле login - запрос не отсылаем.
    await axios.get(`api/identification/${login}`)
      .then(({data}) => {
        isLogin = data.isLogin
      })
      .catch(console.log)
  }
  
  if(isRegistrationInterface)
    return Promise.resolve(!isLogin)
  return Promise.resolve(isLogin)
}
