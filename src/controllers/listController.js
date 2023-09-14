// src/controllers/taskController.js

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./src/database/main.db");

exports.getList = (req, res) => {
  const listId = req.params.listId;

  const query = `
  SELECT *
  FROM lists
  WHERE id = ?;
`;

  db.get(query, [listId], (err, row) => {
    if (err) {
      res.status(500).json({ error: "Failed to get list: " + err.message });
    } else {
      res.json(row);
    }
  });
};

exports.getListTasksById = (req, res) => {
  const query = `
  SELECT t.*
  FROM tasks t
  JOIN task_list_association tla ON t.id = tla.task_id
  JOIN lists l ON tla.list_id = l.id
  WHERE l.id = ?;
`;
  const listId = req.params.listId;

  db.all(query, [listId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: "Failed to get list: " + err.message });
    } else {
      res.json(rows);
    }
  });
};

exports.disassociateTask = (req, res) => {
  const listId = req.params.listId;
  const taskId = req.params.taskId;

  const query = `
  DELETE FROM task_list_association
  WHERE task_id = ? AND list_id = ?;
`;

  db.run(query, [taskId, listId], function (err, result) {
    if (err) {
      res
        .status(500)
        .json({ error: "Failed to delete task from list: " + err.message });
    } else {
      res.json({ success: true });
    }
  });
};

exports.associateTask = (req, res) => {
  const listId = req.params.listId;
  const taskId = req.params.taskId;
  console.log("Moving", taskId, "to", listId, "list");

  const query = `
  INSERT INTO task_list_association (task_id, list_id)
  VALUES (?, ?);
`;

  db.run(query, [taskId, listId], function (err, result) {
    if (err) {
      res
        .status(500)
        .json({ error: "Failed to associate task to list: " + err.message });
    } else {
      res.json({ success: true });
    }
  });
};
