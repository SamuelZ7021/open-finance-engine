import { useAlertStore } from '../store/useAlertStore';
import type { AlertType } from '../components/ui/Alert';

export const useAlert = () => {
  const { addAlert, removeAlert } = useAlertStore();

  const showAlert = (
    type: AlertType,
    title: string,
    message: string,
    autoCloseDuration = 5000
  ) => {
    return addAlert({
      type,
      title,
      message,
      autoCloseDuration
    });
  };

  const success = (title: string, message: string) => 
    showAlert('success', title, message);

  const error = (title: string, message: string) => 
    showAlert('error', title, message);

  const info = (title: string, message: string) => 
    showAlert('info', title, message);

  const warning = (title: string, message: string) => 
    showAlert('warning', title, message);

  return {
    showAlert,
    success,
    error,
    info,
    warning,
    removeAlert
  };
};
