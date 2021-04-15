import { Notification } from "../models/Notification";
import studentInvitation from "./studentInvitation";
import relationConfirmation from "./relationConfirmation";

export function registerNotifTypes(): void {
  Notification.registerType("studentInvitation", studentInvitation);
  Notification.registerType("relationConfirmation", relationConfirmation);
}
