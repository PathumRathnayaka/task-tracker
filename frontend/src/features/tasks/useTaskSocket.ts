import { useEffect, useRef, useState } from 'react'
import { createStompClient } from '../../lib/socket'

const TOPICS = [
  '/topic/tasks/created',
  '/topic/tasks/updated',
  '/topic/tasks/deleted',
]

export function useTaskSocket(onChange: () => void) {
  const handler = useRef(onChange)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    handler.current = onChange
  }, [onChange])

  useEffect(() => {
    const client = createStompClient()

    client.onConnect = () => {
      setConnected(true)
      TOPICS.forEach((topic) =>
        client.subscribe(topic, () => handler.current()),
      )
    }
    client.onWebSocketClose = () => setConnected(false)

    client.activate()
    return () => {
      void client.deactivate()
    }
  }, [])

  return { connected }
}
