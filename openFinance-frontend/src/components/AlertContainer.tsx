import { useAlertStore } from '../store/useAlertStore';
import Alert from './ui/Alert';


const AlertContainer = () => {
  const alerts = useAlertStore((state) => state.alerts);
  const removeAlert = useAlertStore((state) => state.removeAlert);

  return (
    <div className="fixed top-4 right-4 space-y-3 z-[9999] max-w-md pointer-events-none">
      {alerts.map((alert) => (
        <div key={alert.id} className="pointer-events-auto">
          <Alert
            type={alert.type}
            title={alert.title}
            message={alert.message}
            onClose={() => removeAlert(alert.id)}
            autoCloseDuration={alert.autoCloseDuration}
          />
        </div>
      ))}
    </div>
  );
};

export default AlertContainer;
