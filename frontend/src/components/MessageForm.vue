<script setup lang="ts">
import { ref } from 'vue';
import { api } from '../api';
import { Message } from '../types';

const content = ref('');
const { chatId } = defineProps<{
  chatId: string;
}>();

const emit = defineEmits<{
  newMessage: [message: Message];
}>();

function handleSubmit() {
  api
    .post<{ message: Message }>(`/messages/${chatId}/new`, { content: content.value })
    .then(res => {
      emit('newMessage', res.data.message);
    });
  content.value = '';
}
</script>

<template>
  <form class="flex" @submit.prevent="handleSubmit">
    <textarea
      required
      class="flex-1 px-1 py-2 resize-none"
      type="text"
      name="content"
      v-model="content"
    />
    <button type="submit" class="bg-emerald-500 text-slate-700 px-4">Send</button>
  </form>
</template>
