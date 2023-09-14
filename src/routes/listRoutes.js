const express = require("express");
const listController = require("../controllers/listController");

const router = express.Router();

router.route("/:listId")
  .get(listController.getList);

router.route("/:listId/tasks")
  .get(listController.getListTasksById)

router.route("/:listId/tasks/:taskId/associate")
  .delete(listController.disassociateTask)
  .post(listController.associateTask);


module.exports = router;