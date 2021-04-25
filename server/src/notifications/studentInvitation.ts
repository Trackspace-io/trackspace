import { User } from "../models/User";
import { Classroom } from "../models/Classroom";
import { INotificationInfo, INotificationType } from "../models/Notification";

interface INotifParams {
  studentId: string;
  classroomId: string;
}

async function info(params: INotifParams): Promise<INotificationInfo> {
  // Get the classroom and the teacher.
  const classroom = await Classroom.findById(params.classroomId);
  const teacher = classroom ? await classroom.getTeacher() : null;

  // Compute the text of the notification.
  const text = classroom
    ? `You were invited to join ${teacher.fullName}'s ` +
      `classroom, ${classroom.name}`
    : "You received an invitation to join a classroom that doesn't " +
      "exist anymore.";

  // Return notification object.
  return {
    text,
    actions: [
      { id: "accept", text: "Accept" },
      { id: "refuse", text: "Refuse" },
    ],
  };
}

async function isValid(params: INotifParams): Promise<boolean> {
  const classroom = await Classroom.findById(params.classroomId);
  if (!classroom) return false;

  const student = await User.findById(params.studentId);
  if (!student) return false;

  return !(await student.isInClassroom(classroom));
}

async function process(action: string, params: INotifParams): Promise<void> {
  const classroom = await Classroom.findById(params.classroomId);
  if (!classroom) return;

  const student = await User.findById(params.studentId);
  if (!student) return;

  switch (action) {
    case "accept":
      await classroom.addStudent(student);
      await classroom.save();
      return;

    case "refuse":
    default:
      return;
  }
}

const notificationType: INotificationType<INotifParams> = {
  info,
  process,
  isValid,
  serializeParams: JSON.stringify,
  deserializeParams: JSON.parse,
};

export default notificationType;
