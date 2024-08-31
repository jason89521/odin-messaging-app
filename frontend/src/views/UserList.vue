<script setup lang="ts">
import { ref } from 'vue';
import { User } from '../types';
import { api } from '../api';
import { RouterLink, useRouter } from 'vue-router';
import { store } from '../store';

type UserInfo = Pick<User, 'id' | 'username'>;

const users = ref([] as UserInfo[]);
const router = useRouter();

api.get<{ items: UserInfo[] }>('/users/list').then(res => {
  users.value = res.data.items;
});

function createChat({ id, username }: UserInfo) {
  const me = store.getMeOrThrow();
  api
    .post<{ id: string }>('/chats/create', {
      admin: me.id,
      user: id,
      name: `Chat with ${username}`,
    })
    .then(res => {
      router.push(`/chats/${res.data.id}`);
    });
}
</script>

<template>
  <ul>
    <li
      :key="user.id"
      v-for="user in users"
      class="border-b border-slate-300 flex items-center px-4"
    >
      <RouterLink class="block flex-1 py-6" :to="`/users/${user.id}`">{{
        user.username
      }}</RouterLink>
      <button class="border-2 rounded p-1 border-slate-800 text-red-50" @click="createChat(user)">
        Create Chat
      </button>
    </li>
  </ul>
</template>
