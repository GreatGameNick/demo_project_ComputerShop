export interface LoginForms {
  [key: string]: {
    name: string,
    value: string,
    placeholder?: string,
    mask?: string,
    validator?: string,
    isDirty: boolean
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


