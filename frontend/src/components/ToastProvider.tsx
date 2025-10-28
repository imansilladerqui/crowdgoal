import { Toaster } from "sonner";

export const ToastProvider = () => {
  return (
    <Toaster
      position="bottom-right"
      richColors
      expand={true}
      duration={3000}
      closeButton
    />
  );
};

