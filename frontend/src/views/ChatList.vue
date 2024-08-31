<script setup lang="ts">
import { ref } from 'vue';
import { api } from '../api';
import { RouterLink } from 'vue-router';
import { Chat } from 'database/types';

const chats = ref([] as Chat[]);

api.get<{ items: Chat[] }>('/chats/list').then(res => {
  chats.value = res.data.items;
});
</script>

<template>
  <ul>
    <li
      :key="chat.id"
      v-for="chat in chats"
      class="border-b border-slate-300 flex items-center px-4"
    >
      <RouterLink class="block flex-1 py-6" :to="`/chats/${chat.id}`">{{ chat.name }}</RouterLink>
    </li>
  </ul>
</template>
