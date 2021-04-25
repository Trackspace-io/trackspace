import { User } from "../models/User";
import { INotificationInfo, INotificationType } from "../models/Notification";
import { UserRelation } from "../models/UserRelation";

interface INotifParams {
  senderId: string;
  recipientId: string;
}

async function info(params: INotifParams): Promise<INotificationInfo> {
  let text = "";
  const sender = await User.findById(params.senderId);

  switch (sender.role) {
    case "student": {
      const studentInfo = `${sender.fullName} (${sender.email})`;
      text = `${studentInfo} wants to add you as tutor/parent.`;
      break;
    }
    case "parent": {
      const parentInfo = `${sender.fullName} (${sender.email})`;
      text = `${parentInfo} indicated that he/she is your tutor/parent.`;
      break;
    }
    default:
      break;
  }

  // Return notification object.
  return {
    text,
    actions: [
      { id: "confirm", text: "Confirm" },
      { id: "delete", text: "Delete" },
    ],
  };
}

async function isValid(params: INotifParams): Promise<boolean> {
  const recipient = await User.findById(params.recipientId);
  if (!recipient) return false;

  const sender = await User.findById(params.senderId);
  if (!sender) return false;

  const relation = await UserRelation.findByUsers(sender, recipient);
  if (!recipient) return false;

  return !relation.confirmed;
}

async function process(action: string, params: INotifParams): Promise<void> {
  const sender = await User.findById(params.senderId);
  const recipient = await User.findById(params.recipientId);

  if (!sender || !recipient) return;

  switch (action) {
    case "confirm": {
      await recipient.confirmRelationWith(sender);
      return;
    }
    case "delete": {
      await recipient.removeRelatedUser(sender);
      return;
    }
    default:
      return;
  }
}

const relationConfirmation: INotificationType<INotifParams> = {
  info,
  process,
  isValid,
  serializeParams: JSON.stringify,
  deserializeParams: JSON.parse,
};

export default relationConfirmation;
