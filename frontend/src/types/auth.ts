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

export interface Authentication {     //запрос и ответ Аутентификации
  login: string | boolean,
  password: string | boolean
}

export type AuthData = {       //для ответа сервера с допуском для авторизации. Формально требуется для типизации промиса у запроса CREATE_ACCOUNT и LOGIN.
  accessToken: string,
  userLogin: string
}

export interface AuthState {    //тип для Store в целом.
  isAuthorization: boolean,
  accessTokenClosure: Function | null
  userLogin: string
}


