import { User } from "../models/User";
import { INotificationInfo, INotificationType } from "../models/Notification";
import { UserRelation } from "../models/UserRelation";

interface INotifParams {
  senderId: string;
  recipientId: string;
}

async function info(params: INotifParams): Promise<INotificationInfo> {
  const recipient = await User.findById(params.recipientId);

  let text =
    "You received an invitation from a user who doesn't exist anymore.";

  if (recipient) {
    if (recipient.role === "student") {
      const studentInfo = `${recipient.fullName} (${recipient.email})`;
      text = `${studentInfo} wants to add you as tutor/parent.`;
    } else if (recipient.role === "teacher") {
      const parentInfo = `${recipient.fullName} (${recipient.email})`;
      text = `${parentInfo} indicated that he/she is your tutor/parent.`;
    }
  }

  // Return notification object.
  return { text, actions: ["Confirm", "Delete"] };
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
    case "Confirm":
      await recipient.confirmRelationWith(sender);
      return;

    case "Delete":
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
