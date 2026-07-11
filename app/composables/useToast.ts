interface Toast {
  id: number
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
}

export const useToast = () => {
  const toasts = useState<Toast[]>('toasts', () => [])
  
  const remove = (id: number) => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  const show = (type: Toast['type'], message: string, duration = 4000) => {
    const id = Date.now() + Math.random()
    toasts.value.push({ id, type, message })
    setTimeout(() => {
      remove(id)
    }, duration)
  }

  const success = (message: string) => show('success', message)
  const error = (message: string) => show('error', message)
  const warning = (message: string) => show('warning', message)
  const info = (message: string) => show('info', message)

  return { toasts, show, success, error, warning, info, remove }
}
