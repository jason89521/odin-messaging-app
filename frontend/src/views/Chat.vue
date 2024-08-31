<script setup lang="ts">
import { computed, nextTick, ref, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import { api } from '../api';
import { store } from '../store';
import { Message } from '../types';
import MessageForm from '../components/MessageForm.vue';

const route = useRoute();
const chatId = computed(() => route.params.chatId as string);
const messages = ref<Message[]>([]);
const before = ref<null | string>(null);
const list = ref<HTMLUListElement | null>(null);

async function scrollToBottom() {
  await nextTick();
  list.value?.scrollBy({ top: Number.MAX_SAFE_INTEGER });
}

watchEffect(cleanup => {
  if (!store.socket) {
    return;
  }
  const socket = store.socket;
  function onReceiveMessage({ message }: { message: Message }) {
    messages.value.push(message);
    scrollToBottom();
  }
  socket.on('receiveMessage', onReceiveMessage);
  cleanup(() => {
    socket.off('receiveMessage', onReceiveMessage);
  });
});

watchEffect(() => {
  api
    .get<{ items: Message[]; before: string | null }>(`/messages/${chatId.value}`, {
      params: { before: before.value },
    })
    .then(({ data }) => {
      before.value = data.before;
      messages.value = [...data.items, ...messages.value];
      scrollToBottom();
    });
});

function selfClass(message: Message) {
  return message.authorId === store.me?.id ? 'self-end' : '';
}

function handleNewMessage(message: Message) {
  messages.value.push(message);
  scrollToBottom();
}
</script>

<template>
  <div class="flex flex-col h-full">
    <ul ref="list" class="flex flex-1 gap-4 flex-col items-start px-4 py-8 overflow-auto">
      <li
        v-for="message in messages"
        :key="message.id"
        :class="`max-w-[75%] ${selfClass(message)}`"
      >
        <div>
          {{ message.authorName }}
        </div>
        <div class="px-2 py-4 rounded bg-emerald-500">
          {{ message.content }}
        </div>
      </li>
    </ul>
    <MessageForm @new-message="handleNewMessage" :chat-id="chatId" />
  </div>
</template>
