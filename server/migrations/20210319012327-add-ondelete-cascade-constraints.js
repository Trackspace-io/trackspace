"use strict";

module.exports = {
  up: async (queryInterface) => {

    // Remove the constraints.
    queryInterface.removeConstraint(
      "Term",
      "Term_ClassroomId_fkey"
    );

    queryInterface.removeConstraint(
      "Subject",
      "Subject_ClassroomId_fkey"
    );

    queryInterface.removeConstraint(
      "Classroom_Student",
      "Classroom_Student_ClassroomId_fkey"
    );

    // Re-create the constraints.
    queryInterface.addConstraint("Term", {
      type: "FOREIGN KEY",
      name: "Term_ClassroomId_fkey",
      fields: ["ClassroomId"],
      references: {
        table: "Classroom",
        field: "id"
      },
      onDelete: "CASCADE"
    });

    queryInterface.addConstraint("Subject", {
      type: "FOREIGN KEY",
      name: "Subject_ClassroomId_fkey",
      fields: ["ClassroomId"],
      references: {
        table: "Classroom",
        field: "id"
      },
      onDelete: "CASCADE"
    });

    queryInterface.addConstraint("Classroom_Student", {
      type: "FOREIGN KEY",
      name: "Classroom_Student_ClassroomId_fkey",
      fields: ["ClassroomId"],
      references: {
        table: "Classroom",
        field: "id"
      },
      onDelete: "CASCADE"
    });
  },

  down: async (queryInterface) => {
    // Remove the constraints.
    queryInterface.removeConstraint(
      "Term",
      "Term_ClassroomId_fkey"
    );

    queryInterface.removeConstraint(
      "Subject",
      "Subject_ClassroomId_fkey"
    );

    queryInterface.removeConstraint(
      "Classroom_Student",
      "Classroom_Student_ClassroomId_fkey"
    );

    // Re-create the constraints.
    queryInterface.addConstraint("Term", {
      type: "FOREIGN KEY",
      name: "Term_ClassroomId_fkey",
      fields: ["ClassroomId"],
      references: {
        table: "Classroom",
        field: "id"
      }
    });

    queryInterface.addConstraint("Subject", {
      type: "FOREIGN KEY",
      name: "Subject_ClassroomId_fkey",
      fields: ["ClassroomId"],
      references: {
        table: "Classroom",
        field: "id"
      }
    });

    queryInterface.addConstraint("Classroom_Student", {
      type: "FOREIGN KEY",
      name: "Classroom_Student_ClassroomId_fkey",
      fields: ["ClassroomId"],
      references: {
        table: "Classroom",
        field: "id"
      }
    });
  }
};
