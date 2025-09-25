import { useState } from "react";

export const useDialog = (initialOpen = false, initialMessage = "") => {
  const [open, setOpen] = useState(initialOpen);
  const [message, setMessage] = useState(initialMessage);

  const show = () => setOpen(true);

  const hide = () => setOpen(false);
  const toggle = () => setOpen((prev) => !prev);
  const updateMessage = (msg: string) => setMessage(msg);

  return {
    open,
    message,
    setMessage: updateMessage,
    setOpen,
    show,
    hide,
    toggle,
  };
};
