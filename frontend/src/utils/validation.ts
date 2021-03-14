import axios from "axios";
import {Auth} from '@/types/auth'



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


// export const isUnique = async (isRegistrationInterface: boolean) => async (value: string): Promise<Auth | boolean> => {
//   //директива .lezy у v-modal не требуется, ее роль играет маска.
//   console.log('=========== isRegistrationInterface - value', value)
//   console.log('=========== isRegistrationInterface', isRegistrationInterface)
//
//   // if (value === '' && !isRegistrationInterface)
//   //   return  Promise.resolve(true)
//   //
//   // return await axios.get(`api/authStatus/${value}`)
//
//   return Promise.resolve(true)
// }

export const isUnique = function (w: boolean) {
  console.log('=========== isUnique = ', w)
  
  // return function (value: boolean) {
  //   console.log('=========== isRegistrationInterface', isRegistrationInterface)
  //   console.log('=========== isRegistrationInterface - value', value)
  //   return Promise.resolve(true)
  // }
}
