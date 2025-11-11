import 'vue-sonner/style.css'
import { toast } from 'vue-sonner'

export const showToast = (text: string, type?: 'success' | 'error' | 'info' | 'warning') => {
  if (type === 'success') {
    toast.success(text)
  } else if (type === 'error') {
    toast.error(text)
  } else if (type === 'info') {
    toast.info(text)
  } else if (type === 'warning') {
    toast.warning(text)
  } else {
    toast(text)
  }
}
