<script setup lang="ts">
import { useRouter } from 'vue-router';
import { store } from '../store';
const router = useRouter();

function handleBack() {
  router.back();
}

function handleLogout() {
  store.logout();
  router.push('/');
}
</script>

<template>
  <div class="flex bg-slate-200 h-16 justify-between px-4">
    <button @click="handleBack">Back</button>
    <button @click="handleLogout">Logout</button>
  </div>
</template>
