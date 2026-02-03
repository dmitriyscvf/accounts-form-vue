<script setup lang="ts">
import { computed } from 'vue'
import { useAccountsStore } from '../store/accounts'
import AccountRow from './AccountRow.vue'

const store = useAccountsStore()
const accounts = computed(() => store.accounts)

function add() {
  store.addAccount()
}
</script>

<template>
  <section class="wrap">
    <header class="header">
      <h2>Учетные записи</h2>
      <button class="add" @click="add">+</button>
    </header>

    <div class="hint">
      Подсказка: поле «Метка» — вводите несколько значений через <b>;</b>
      (например: <code>admin; prod; vpn</code>)
    </div>

    <div class="head">
      <div>Метка</div>
      <div>Тип записи</div>
      <div>Логин</div>
      <div>Пароль</div>
      <div></div>
    </div>

    <AccountRow
      v-for="acc in accounts"
      :key="acc.id"
      :account="acc"
    />

    <div v-if="accounts.length === 0" class="empty">
      Нажмите <b>+</b>, чтобы добавить первую учетную запись
    </div>
  </section>
</template>

<style scoped>
.wrap {
  max-width: 980px;
  margin: 24px auto;
  padding: 16px;
  font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.add {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid #ccc;
  cursor: pointer;
  font-size: 20px;
  line-height: 1;
}

.hint {
  margin-top: 10px;
  padding: 10px 12px;
  border: 1px solid #e5e5e5;
  border-radius: 10px;
  background: #fafafa;
  color: #444;
}

.head {
  margin-top: 14px;
  display: grid;
  grid-template-columns: 2fr 1fr 2fr 2fr 56px;
  gap: 12px;
  font-weight: 600;
  color: #666;
}

.empty {
  margin-top: 14px;
  color: #777;
  padding: 12px;
  border: 1px dashed #ddd;
  border-radius: 10px;
}
</style>
