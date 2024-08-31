<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { api } from '../api';
import { store } from '../store';
import { useRouter } from 'vue-router';

const username = ref('');
const password = ref('');
const router = useRouter();

watchEffect(() => {
  if (store.me) {
    router.push('/users');
  }
});

function handleSubmit(login: boolean) {
  const url = `/auth/${login ? 'login' : 'sign-up'}`;
  api
    .post<{ jwt: string }>(url, { username: username.value, password: password.value })
    .then(async res => {
      const { jwt } = res.data;
      store.setup(jwt);
    });
}
</script>

<template>
  <div class="flex justify-center items-center h-full">
    <form @submit.prevent="handleSubmit(true)" class="flex flex-col px-2 py-4 gap-4">
      <label class="flex flex-col">
        <span>Username: </span>
        <input required type="text" name="username" v-model="username" />
      </label>
      <label class="flex flex-col">
        <span>Password: </span>
        <input required type="password" name="password" v-model="password" />
      </label>
      <button type="submit" class="border-2 bg-emerald-500 text-slate-900 rounded">Login</button>
      <button
        type="button"
        class="border-2 bg-emerald-500 text-slate-900 rounded"
        @click="handleSubmit(false)"
      >
        Signup
      </button>
    </form>
  </div>
</template>
