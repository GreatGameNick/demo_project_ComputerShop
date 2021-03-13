export interface LoginForms {
  [key: string]: {
    name: string,
    inputType: string,
    value: string,
    placeholder?: string,
    mask?: string,
  }
}

export interface AuthData {
  login: string,
  password: string
}

export interface UserData {
  userName: string,
  userStatus: string,
  userData: string
}

export type Token = string

export interface AuthResponse {
  login: boolean,
  accessToken: Token,
  refreshToken: Token,
  userData: UserData
}


export interface AuthState {
  token: string
}


