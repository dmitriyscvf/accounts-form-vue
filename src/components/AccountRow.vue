<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { Account, AccountType } from '../types/account'
import { parseLabelToItems, itemsToLabelString } from '../utils/label'
import { useAccountsStore } from '../store/accounts'

const props = defineProps<{ account: Account }>()
const store = useAccountsStore()

type Field = 'label' | 'login' | 'password'

const draft = reactive({
  labelInput: itemsToLabelString(props.account.label),
  type: props.account.type as AccountType,
  login: props.account.login,
  password: props.account.password ?? '',
})

const touched = reactive<Record<Field, boolean>>({
  label: false,
  login: false,
  password: false,
})

const errors = reactive<Record<Field, string | null>>({
  label: null,
  login: null,
  password: null,
})

watch(
  () => props.account,
  (a) => {
    draft.labelInput = itemsToLabelString(a.label)
    draft.type = a.type
    draft.login = a.login
    draft.password = a.password ?? ''
  },
  { deep: true }
)

function validateAll(): boolean {
  errors.label = null
  errors.login = null
  errors.password = null

  // Метка: необязательное, <= 50
  if (draft.labelInput.length > 50) errors.label = 'Максимум 50 символов'

  // Логин: обязательное, <= 100
  if (!draft.login.trim()) errors.login = 'Обязательное поле'
  else if (draft.login.length > 100) errors.login = 'Максимум 100 символов'

  // Пароль: обязательное только LOCAL, <= 100
  if (draft.type === 'LOCAL') {
    if (!draft.password.trim()) errors.password = 'Обязательное поле'
    else if (draft.password.length > 100) errors.password = 'Максимум 100 символов'
  }

  return !errors.label && !errors.login && !errors.password
}

function commitIfValid() {
  if (!validateAll()) return

  const updated: Account = {
    id: props.account.id,
    label: parseLabelToItems(draft.labelInput),
    type: draft.type,
    login: draft.login,
    password: draft.type === 'LDAP' ? null : draft.password,
  }

  store.saveAccount(updated)
}

function onBlur(field: Field) {
  touched[field] = true
  commitIfValid()
}

function onTypeChange(value: AccountType) {
  draft.type = value
  store.changeType(props.account.id, value)

  // при LDAP пароль перестает быть обязательным, очищаем ошибки пароля
  if (value === 'LDAP') {
    errors.password = null
    touched.password = false
  }

  commitIfValid()
}

function remove() {
  store.removeAccount(props.account.id)
}

function showError(field: Field) {
  return touched[field] && !!errors[field]
}
</script>

<template>
  <div class="row">
    <div>
      <input
        v-model="draft.labelInput"
        maxlength="50"
        placeholder="Напр.: admin; prod"
        @blur="onBlur('label')"
        :class="{ bad: showError('label') }"
      />
      <small v-if="showError('label')" class="err">{{ errors.label }}</small>
    </div>

    <div>
      <select v-model="draft.type" @change="onTypeChange(draft.type)">
        <option value="LDAP">LDAP</option>
        <option value="LOCAL">Локальная</option>
      </select>
    </div>

    <div>
      <input
        v-model="draft.login"
        maxlength="100"
        placeholder="Логин"
        @blur="onBlur('login')"
        :class="{ bad: showError('login') }"
      />
      <small v-if="showError('login')" class="err">{{ errors.login }}</small>
    </div>

    <div>
      <input
        v-if="draft.type === 'LOCAL'"
        v-model="draft.password"
        maxlength="100"
        placeholder="Пароль"
        @blur="onBlur('password')"
        :class="{ bad: showError('password') }"
      />
      <div v-else class="dash">—</div>

      <small v-if="draft.type === 'LOCAL' && showError('password')" class="err">
        {{ errors.password }}
      </small>
    </div>

    <button class="del" @click="remove" title="Удалить">🗑</button>
  </div>
</template>

<style scoped>
.row {
  display: grid;
  grid-template-columns: 2fr 1fr 2fr 2fr 56px;
  gap: 12px;
  align-items: start;
  margin: 10px 0;
}

input, select {
  width: 100%;
  padding: 7px 10px;
  border: 1px solid #cfcfcf;
  border-radius: 10px;
  outline: none;
  background: white;
}

select { height: 34px; }

.bad {
  border-color: #e53935;
}

.err {
  display: block;
  color: #e53935;
  font-size: 12px;
  margin-top: 4px;
}

.del {
  height: 34px;
  border-radius: 10px;
  border: 1px solid #ccc;
  cursor: pointer;
}

.dash {
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.55;
  border: 1px dashed #ddd;
  border-radius: 10px;
}
</style>
