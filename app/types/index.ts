export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  text: string
}

export interface Chat {
  messages: ChatMessage[]
}
