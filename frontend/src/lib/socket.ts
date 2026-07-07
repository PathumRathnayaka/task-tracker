import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

const wsUrl = import.meta.env.VITE_WS_URL ?? 'http://localhost:8080/ws'

export function createStompClient(): Client {
  return new Client({
    webSocketFactory: () => new SockJS(wsUrl),
    reconnectDelay: 5000,
  })
}
