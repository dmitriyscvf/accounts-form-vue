import { defineStore } from 'pinia'
import type { Account, AccountType } from '../types/account' // <-- важно: относительный импорт

const STORAGE_KEY = 'accounts'

function loadFromStorage(): Account[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Account[]) : []
  } catch {
    return []
  }
}

function saveToStorage(accounts: Account[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts))
}

export const useAccountsStore = defineStore('accounts', {
  state: () => ({
    accounts: loadFromStorage() as Account[],
  }),

  actions: {
    addAccount() {
      this.accounts.push({
        id: crypto.randomUUID(),
        label: [],
        type: 'LOCAL',
        login: '',
        password: '',
      })

      saveToStorage(this.accounts)
    },

    removeAccount(id: string) {
      this.accounts = this.accounts.filter(a => a.id !== id)
      saveToStorage(this.accounts)
    },

    saveAccount(account: Account) {
      const index = this.accounts.findIndex(a => a.id === account.id)

      if (index === -1) this.accounts.push(account)
      else this.accounts[index] = account

      saveToStorage(this.accounts)
    },

    changeType(id: string, type: AccountType) {
      const acc = this.accounts.find(a => a.id === id)
      if (!acc) return

      acc.type = type
      if (type === 'LDAP') acc.password = null
      if (type === 'LOCAL' && acc.password === null) acc.password = ''

      saveToStorage(this.accounts)
    },
  },
})
