export type AccountType = 'LDAP' | 'LOCAL'

export interface LabelItem {
  text: string
}

export interface Account {
  id: string
  label: LabelItem[]
  type: AccountType
  login: string
  password: string | null
}
