import { Router } from "express";
import classrooms from "./classrooms";
import users from "./users";

const router = Router();

router.use("/users", users);
router.use("/classrooms", classrooms);

export default router;
