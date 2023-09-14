const express = require("express");
const taskController = require("../controllers/taskController");

const router = express.Router();

router.route("/")
  .put(taskController.updateTask)
  .post(taskController.createTask);

router.route("/:taskId")
  .delete(taskController.deleteTask);

router.route("/todo")
  .get(taskController.getTodos);

module.exports = router;