<template>
  <div>
    <!-- Floating Action Button -->
    <q-fab
      v-model="fab1"
      @update:model-value="fab1"
      icon="chat"
      class="fixed-bottom-left q-mb-md q-ml-md z-max"
      color="primary"
      @click="visible = !visible"
    />

    <!-- Chat Box -->
    <q-card
      v-if="visible"
      class="fixed-bottom-left q-mb-md q-ml-md z-max shadow-8 chat-container"
      style="margin-bottom: 100px;"
    >
      <q-bar class="bg-primary text-white">
        <div class="text-subtitle2">AI Assistant</div>
        <q-space />
        <q-btn dense flat icon="close" @click="visible = false;fab1 = false" />
      </q-bar>

<q-scroll-area class="chat-scroll-area" ref="scrollRef" style="height: 250px;">
        <div class="q-pa-sm">
          <div
            v-for="msg in messages"
            :key="msg.id"
            :class="['chat-message', msg.from === 'user' ? 'user' : 'bot']"
          >
            <q-avatar
              size="24px"
              class="q-mr-sm"
              v-if="msg.from === 'bot'"
            >
              <q-icon name="smart_toy" />
            </q-avatar>
            <div class="bubble">{{ msg.text }}</div>
          </div>
        </div>
      </q-scroll-area>

      <q-separator />

      <q-input
        filled
        dense
        v-model="input"
        placeholder="Type your message..."
        @keyup.enter="sendMessage"
        class="q-pa-sm"
      >
        <template v-slot:append>
          <q-btn flat round icon="send" @click="sendMessage" />
        </template>
      </q-input>
    </q-card>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'

const messages = ref([])
const input = ref('')
const visible = ref(false)
const scrollRef = ref(null)
const fab1 = ref(false);
const scrollToBottom = () => {
  nextTick(() => {
    if (scrollRef.value) {
      scrollRef.value.refresh(); // Force it to recalculate dimensions
      scrollRef.value.setScrollPercentage('vertical', 1)
    }
  })
}


const sendMessage = async () => {
  if (!input.value.trim()) return

  const userText = input.value
  messages.value.push({ id: Date.now(), text: userText, from: 'user' })
  console.log('Messages:', messages.value)

  input.value = ''
  scrollToBottom()

  try {
    const res = await fetch('https://nuxt.meidanm.com/wp-json/ai-chat/v1/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userText })
    })

    const data = await res.json()
    messages.value.push({ id: Date.now() + 1, text: data.reply, from: 'bot' })
    console.log('Messages:', messages.value)

    scrollToBottom()
  } catch (e) {
    console.error(e)
    messages.value.push({ id: Date.now() + 2, text: 'Failed to get response.', from: 'bot' })
    console.log('Messages:', messages.value)

    scrollToBottom()
  }
}
</script>
