import { Router } from "express";
import classrooms from "./classrooms";
import progress from "./progress";
import users from "./users";

const router = Router();

router.use("/users", users);
router.use("/classrooms", classrooms);
router.use("/progress", progress);

export default router;
