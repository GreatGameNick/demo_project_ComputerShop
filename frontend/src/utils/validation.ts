import axios from "axios";
import {AuthResponse} from '@/types/auth'

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

export const isUnique = async (isRegistrationInterface: boolean) => (value: string): Promise<AuthResponse> | boolean => {
  //директива .lezy у v-modal не требуется, ее роль играет маска.
  if (value === '' && !isRegistrationInterface)
    return true
  return await axios.get(`api/checkOutAuthData/${value}`)
}





