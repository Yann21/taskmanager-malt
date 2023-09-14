// src/controllers/taskController.js

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./src/database/main.db");

exports.deleteTask = (req, res) => {
  const taskName = req.params.taskId;

  db.run(
    "DELETE FROM tasks WHERE id = ?",
    [taskName],
    function (err, result) {
      if (err) {
        return res
          .status(500)
          .json({ error: "Failed to delete task: " + err.message });
      }
      res.json({ success: true });
    }
  );
};

exports.updateTask = (req, res) => {
  const data = req.body;
  const sourceItem = data.sourceItem;
  const targetProject = data.targetProject;

  db.serialize(() => {
    db.run("BEGIN TRANSACTION;");

    const addQuery = `
      INSERT INTO task_list_association (task_id, list_id)
      SELECT
        tasks.id AS task_id,
        kanbans.todo_list_id AS list_id
      FROM
        tasks, kanbans
      WHERE
        tasks.name = ? AND kanbans.name = ?;
    `;

    db.run(addQuery, [sourceItem, targetProject], (err) => {
      if (err) {
        db.run("ROLLBACK;", () => {
          res
            .status(500)
            .json({ error: "Failed to move item: " + err.message });
        });
        return;
      }

      const removeQuery = `
        DELETE FROM task_list_association
        WHERE task_id = (SELECT id FROM tasks WHERE name = ?)
        AND list_id NOT IN (SELECT todo_list_id FROM kanbans WHERE name = ?);
      `;

      db.run(removeQuery, [sourceItem, targetProject], (err) => {
        if (err) {
          db.run("ROLLBACK;", () => {
            res
              .status(500)
              .json({ error: "Failed to move item: " + err.message });
          });
          return;
        }

        db.run("COMMIT;", () => {
          res.json({ success: true });
        });
      });
    });
  });
};

exports.createTask = (req, res) => {
  const taskName = req.body.taskName;
  console.log("am i getting the taskName", taskName)

  db.run(
    "INSERT INTO tasks (name) VALUES (?)",
    [taskName],
    function (err, result) {
      if (err) {
        res.status(500).json({ error: "Failed to add task: " + err.message });
      } else {
        res.json({ success: true, id: this.lastID });
      }
    }
  );
};

exports.getTodos = (req, res) => {
  try {
    const query = `
      SELECT t.name 
      FROM tasks t 
      JOIN task_list_association tla ON t.id = tla.task_id 
      JOIN kanbans k ON tla.list_id = k.todo_list_id;`;
    db.all(query, [], (err, rows) => {
      if (err) {
        res.status(500).json({ error: "Failed to get global: " + err.message });
      } else {
        const taskNames = rows.map((row) => row.name);
        res.json(taskNames);
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to get global: " + error.message });
  }
};