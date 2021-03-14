export interface LoginForms {
  [key: string]: {
    name: string,
    inputType: string,
    value: string,
    placeholder?: string,
    mask?: string,
  }
}

export interface AuthData {  //запрос авторизации
  login: string,
  password: string
}

export type Token = {
  accessToken: string,
  refreshToken: string
}

export interface AuthResponse extends Token{     //ответ авторизации
  isLoginUnique: boolean,
  password?: string,
}

export interface UserData {    //личные данные по кабинету пользователя
  userName: string,
  userStatus: string,
  userData: string
}

export interface AuthState extends Token, UserData{    //тип для Store вцелом.

}


