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

export type Token = string

export interface AuthState {
  token: string
}


