<script setup>
import { ref, computed } from 'vue'
import rawClients from '../assets/mockClients.js'
import ClientCard from './ClientCard.vue'
import NotificationSystem from './NotificationSystem.vue'
import ClientFilters from './ClientFilters.vue'
import useInterval from '../composables/useInterval.js'

// Реактивная копия клиентов
const clients = ref(rawClients)

// Активные фильтры
const activeFilters = ref({ statuses: [], query: '' })

function handleFilterChange(filters) {
  activeFilters.value = filters
}

// Отфильтрованные клиенты
const filteredClients = computed(() => {
  return clients.value.filter(client => {
    const matchesStatus =
      activeFilters.value.statuses.length === 0 ||
      activeFilters.value.statuses.includes(client.status)
    const matchesQuery =
      client.name.toLowerCase().includes(activeFilters.value.query.toLowerCase())
    return matchesStatus && matchesQuery
  })
})

// Уведомления
const notificationRef = ref(null)

// Для изменения статуса клиента из карточки
function handleStatusChange({ clientId, newStatus }) {
  const client = clients.value.find(c => c.id === clientId)
  if (client) {
    client.status = newStatus
    client.lastUpdated = new Date().toLocaleString()
    notificationRef.value?.addNotification(`Статус ${client.name} изменен на "${newStatus}"`)
  }
}

// Интервал проверки
const { start, stop, isRunning } = useInterval(clients, (message) => {
  notificationRef.value?.addNotification(message)
})

// Обработка кнопок запуска/остановки с уведомлениями
function handleStart() {
  if (!isRunning.value) {
    start()
    notificationRef.value?.addNotification('Проверка запущена')
  } else {
    notificationRef.value?.addNotification('Проверка уже активирована')
  }
}

function handleStop() {
  if (isRunning.value) {
    stop()
    notificationRef.value?.addNotification('Проверка остановлена')
  } else {
    notificationRef.value?.addNotification('Невозможно остановить проверку. Запустите проверку')
  }
}
</script>

<template>
  <div class="dashboard">
    <!-- верхняя панель -->
    <div class="top-bar">
      <div class="top-bar-content">
        <div class="header-row">
          <img src="@/assets/logo.png" alt="Логотип" class="logo" />
          <h1>Client Dashboard</h1>
        </div>

        <div class="controls-filters-row">
          <div class="controls">
            <button @click="handleStart">Запустить проверку</button>
            <button @click="handleStop">Остановить</button>
          </div>
          <ClientFilters @filter-changed="handleFilterChange" />
        </div>
      </div>
    </div>

    <!-- Контент -->
    <div class="content">
      <div v-if="filteredClients.length > 0" class="cards">
        <ClientCard
          v-for="client in filteredClients"
          :key="client.id"
          :client="client"
          @status-changed="handleStatusChange"
        />
      </div>
      <div v-else class="no-results">
        Нет результатов по данному запросу.
      </div>
    </div>

    <NotificationSystem ref="notificationRef" />
  </div>
</template>


<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
}

/* верхняя панель */
.top-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: #262626;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0,0,0,0.5);
}

/* Контейнер панели */
.top-bar-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* Строка с кнопками и фильтрами */
.controls-filters-row {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* Кнопки */
.controls {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0; 
}

.controls button {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  background-color: #444;
  color: #fff;
  transition: background-color 0.2s;
  font-size: 0.95rem;
  width: 280px;
}

.controls button:hover {
  background-color: #7c7c7c;
}

/* Контент */
.content {
  margin-top: 140px;
  width: 100%;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-height: calc(100vh - 140px);
}

/* Карточки */
.cards {
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: flex-start;
}

.no-results {
  width: 100%;
  text-align: center;
  color: #aaa;
  font-size: 1.4rem;
  margin-top: 2rem;
  margin-left: 275px;
}

/* Логотип + заголовок */
.header-row {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo {
  height: 70px;
  width: auto;
  object-fit: contain;
}
</style>
