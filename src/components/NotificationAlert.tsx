import React, { useEffect, useState } from "react";
import { Alert, Button } from "@material-tailwind/react";

interface NotificationAlertProps {
  message: string;
  type?: "info" | "warning" | "error" | "success";
}

export function NotificationAlert({ message, type = "success" }: NotificationAlertProps) {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (message) {
      setOpen(true);
      const timer = setTimeout(() => setOpen(false), 10000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const getAlertColor = () => {
    switch (type) {
      case "info":
        return "blue";
      case "warning":
        return "yellow";
      case "error":
        return "red";
      default:
        return "green";
    }
  };

  return (
    <>
      <Alert
        open={open}
        onClose={() => setOpen(false)}
        animate={{
          mount: { y: 0 },
          unmount: { y: 100 },
        }}
        className={`fixed top-4 right-4 bg-${getAlertColor()}-500 text-white px-4 py-2 rounded-md shadow-md`}
      >
        {message}
      </Alert>
    </>
  );
}
