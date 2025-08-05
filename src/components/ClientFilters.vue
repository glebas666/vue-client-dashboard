<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  initialStatuses: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['filter-changed'])

const statuses = [
  { value: 'active', label: 'Активен' },
  { value: 'issues', label: 'Проблемы' },
  { value: 'completed', label: 'Завершен' },
  { value: 'new', label: 'Новый' },
  { value: 'checking', label: 'Проверка' },
]

const isOpen = ref(false)
const selectedStatuses = ref([...props.initialStatuses])
const query = ref('')

watch([selectedStatuses, query], () => {
  emit('filter-changed', {
    statuses: selectedStatuses.value,
    query: query.value
  })
})

// Сброс фильтров
function resetFilters() {
  selectedStatuses.value = []
  query.value = ''
  emit('filter-changed', {
    statuses: [],
    query: ''
  })
}

function toggleStatus(status) {
  if (selectedStatuses.value.includes(status)) {
    selectedStatuses.value = selectedStatuses.value.filter(s => s !== status)
  } else {
    selectedStatuses.value.push(status)
  }
}
</script>

<template>
  <div class="filter-wrapper">
  <input
    type="text"
    v-model="query"
    placeholder="Поиск по названию организации"
    class="search-input"
  />

  <button class="toggle-btn" @click="isOpen = !isOpen">
    Фильтр
    <span>{{ isOpen ? '▲' : '▼' }}</span>
  </button>

    <div v-if="isOpen" class="dropdown-panel">
      <div class="status-option" v-for="status in statuses" :key="status.value">
        <input
          type="checkbox"
          :id="status.value"
          :value="status.value"
          :checked="selectedStatuses.includes(status.value)"
          @change="toggleStatus(status.value)"
        />
        <label :for="status.value">{{ status.label }}</label>
      </div>

      <button class="reset-btn" @click="resetFilters">Сбросить фильтры</button>
    </div>
  </div>
</template>

<style scoped>
.filter-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  max-width: 600px; 
  width: 100%; 
  margin-left: auto;
}

.search-input {
  flex-grow: 1;
  padding: 0.5rem;
  font-size: 0.95rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  box-sizing: border-box;
}

.toggle-btn {
  background-color: #444;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.95rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  white-space: nowrap;
}

.dropdown-panel {
  position: absolute;
  top: 100%;
  left: 0;
  background-color: #262626;
  border-radius: 6px;
  padding: 1rem;
  margin-top: 0.25rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.5);
  width: 100%;
  z-index: 10;
}

.status-option {
  margin-bottom: 0.5rem;
  color: #eee;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.reset-btn {
  margin-top: 0.5rem;
  background-color: #414141;
  color: white;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  cursor: pointer;
  width: 100%;
}
.reset-btn:hover {
  background-color: #787878;
}
</style>
