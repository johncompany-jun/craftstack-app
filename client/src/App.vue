<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { client } from './lib/hono'

type Task = {
  id: number
  title: string
  completed: boolean
  createdAt: string
}

const tasks = ref<Task[]>([])
const newTitle = ref('')
const loading = ref(false)
const error = ref<string | null>(null)

async function load() {
  loading.value = true
  error.value = null
  try {
    const res = await client.api.tasks.$get()
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    tasks.value = await res.json()
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
  } finally {
    loading.value = false
  }
}

async function add() {
  const title = newTitle.value.trim()
  if (!title) return
  const res = await client.api.tasks.$post({ json: { title } })
  if (!res.ok) return
  const task = await res.json()
  tasks.value.push(task)
  newTitle.value = ''
}

async function toggle(task: Task) {
  const res = await client.api.tasks[':id'].$patch({
    param: { id: String(task.id) },
    json: { completed: !task.completed },
  })
  if (!res.ok) return
  const updated = await res.json()
  const i = tasks.value.findIndex((t) => t.id === updated.id)
  if (i >= 0) tasks.value[i] = updated
}

async function remove(task: Task) {
  const res = await client.api.tasks[':id'].$delete({
    param: { id: String(task.id) },
  })
  if (!res.ok) return
  tasks.value = tasks.value.filter((t) => t.id !== task.id)
}

onMounted(load)
</script>

<template>
  <main>
    <h1>Craftstack Tasks</h1>

    <form @submit.prevent="add">
      <input
        v-model="newTitle"
        type="text"
        placeholder="やることを入力..."
        autofocus
      />
      <button type="submit">追加</button>
    </form>

    <p v-if="loading">読み込み中...</p>
    <p v-else-if="error" style="color: #ff6b6b">エラー: {{ error }}</p>
    <p v-else-if="tasks.length === 0">タスクはまだありません。</p>

    <ul>
      <li v-for="task in tasks" :key="task.id" :class="{ done: task.completed }">
        <input
          type="checkbox"
          :checked="task.completed"
          @change="toggle(task)"
        />
        <span>{{ task.title }}</span>
        <button class="danger" @click="remove(task)">削除</button>
      </li>
    </ul>
  </main>
</template>
