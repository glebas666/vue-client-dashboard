<script setup>
import { ref } from 'vue'

const notifications = ref([])

function addNotification(message) {
  const id = Date.now()
  notifications.value.unshift({ id, message })

  // Удаляем через 10 секунд
  setTimeout(() => {
    notifications.value = notifications.value.filter(note => note.id !== id)
  }, 10000)

  // Оставляем не больше 5
  if (notifications.value.length > 5) {
    notifications.value.pop()
  }
}

// Чтобы можно было использовать снаружи:
defineExpose({ addNotification })
</script>

<template>
  <div class="notifications">
    <div 
      v-for="note in notifications" 
      :key="note.id" 
      class="notification">
      {{ note.message }}
    </div>
  </div>
</template>

<style scoped>
.notifications {
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  z-index: 9999;
}

.notification {
  background-color: rgba(50, 50, 50, 0.9);
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  font-size: 1.0rem;
  width: 350px;
  word-wrap: break-word;
}
</style>
