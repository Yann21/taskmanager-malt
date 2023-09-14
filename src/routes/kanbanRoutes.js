const express = require("express");
const kanbanController = require("../controllers/kanbanController");

const router = express.Router();

router.route("/type/projects")
  .get(kanbanController.getProjects);

router.route("/type/contexts")
  .get(kanbanController.getContexts);

router.route("/:kanbanId")
  .get(kanbanController.getKanban);

router.route("/:kanbanId/lists/:listType/tasks")
  .get(kanbanController.getKanbanList);

router.route("/")
  .post(kanbanController.createKanban);

module.exports = router;