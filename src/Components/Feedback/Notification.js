import { notification } from "antd";
import { ReactNode } from "react";

const showNotification = (type, message, description) => {
  notification[type]({
    message,
    description,
  });
};
export default showNotification;

// type NotificationType =
//     | "success"
//     | "error"
//     | "info"
//     | "warning"
//     | "open"
//     | "warn";
