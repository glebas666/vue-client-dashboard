<script setup>
const props = defineProps({
  client: Object,
})

const emit = defineEmits(['status-changed'])

const statuses = ['active', 'issues', 'completed', 'new', 'checking']

const statusLabels = {
  active: 'Активен',
  issues: 'Проблемы',
  completed: 'Завершен',
  new: 'Новый',
  checking: 'Проверка',
}

const statusColors = {
  active: '#fcd965',
  issues: '#e05f51',
  completed: '#57e34d',
  new: '#6c8ee6',
  checking: '#ff9900',
}

function changeStatus() {
  const currentIndex = statuses.indexOf(props.client.status)
  const nextIndex = (currentIndex + 1) % statuses.length
  const newStatus = statuses[nextIndex]

  // Сообщаем какой клиент и новый код статуса
  emit('status-changed', {
    clientId: props.client.id,
    newStatus,
  })
}
</script>

<template>
  <div class="client-card">
    <h3>{{ client.name }}</h3>
    <p>
      Статус:
      <span :style="{ color: statusColors[client.status] || 'black' }">
        {{ statusLabels[client.status] }}
      </span>
    </p>
    <p>Последнее изменение: {{ client.lastUpdated }}</p>
    <button @click="changeStatus">Сменить статус</button>
  </div>
</template>

<style scoped>
.client-card {
  border: 0.5px solid #707070;
  padding: 1.5rem;
  margin: 1rem 0;
  width: 1200px;
  border-radius: 10px;
  background-color: #000000;
  color: #b3b2b2;
  box-sizing: border-box;
  font-size: 1.2rem;
}

button {
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #6a6a6a;  
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.2s;
  font-size: 0.95rem;
}

button:hover {
  background-color: #d5d5d5; 
}
</style>
