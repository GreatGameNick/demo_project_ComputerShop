export interface LoginForms {
  [key: string]: {
    name: string,
    inputType: string,
    value: string,
    placeholder?: string,
    mask?: string,
  }
}

export interface Identification {      //запрос Идентификации
  login: string
}

export interface Authentication {    //запрос и ответ Аутентификации
  login: string | boolean,
  password: string | boolean
}

export type Authorization = {      //ответ Авторизации, запрос на продление Авторизации, запрос на получение данных.
  isAuthorization: boolean,
  accessToken: string,
  refreshToken: string
}


export interface UserData {    //личные данные по кабинету пользователя
  userName: string,
  userStatus: string,
  userData: string
}

export interface AuthState extends Authorization, UserData{    //тип для Store в целом.
  userLogin: string,
}


