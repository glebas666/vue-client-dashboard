import { ref } from 'vue'

export default function useInterval(clients, notify) {
  const timer = ref(null)
  const isRunning = ref(false)

  function start() {
    if (isRunning.value) return

    timer.value = setInterval(() => {
      // Выбираем случайного клиента
      const randomIndex = Math.floor(Math.random() * clients.value.length)
      const randomClient = clients.value[randomIndex]

      // Меняем статус
      randomClient.status = 'checking'

      // Уведомление
      notify(`Клиент "${randomClient.name}" переведен в "Проверка"`)
    }, 2 * 60 * 1000)

    isRunning.value = true
  }

  function stop() {
    clearInterval(timer.value)
    timer.value = null
    isRunning.value = false
  }

  return { start, stop, isRunning }
}
