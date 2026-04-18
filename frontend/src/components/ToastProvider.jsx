import { Toaster } from 'react-hot-toast'

function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: '#001142',
          color: '#fff',
          padding: '14px 16px',
          borderRadius: '10px',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 600,
        },
        success: {
          iconTheme: { primary: '#006b5f', secondary: '#fff' },
        },
        error: {
          iconTheme: { primary: '#ba1a1a', secondary: '#fff' },
        },
      }}
    />
  )
}

export default ToastProvider