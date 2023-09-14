const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./src/database/main.db");

exports.getProjects = (req, res) => {
  try {
    const query = `SELECT * FROM kanbans WHERE type = 'project';`;
    db.all(query, [], (err, rows) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Failed to get projects: " + err.message });
      }
      const projects = rows.map((row) => {
        return {
          id: row.id,
          name: row.name,
          type: row.type,
          backlog_list_id: row.backlog_list_id,
          todo_list_id: row.todo_list_id,
          done_list_id: row.done_list_id,
        };
      });
      return res.status(200).json(projects);
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getContexts = (req, res) => {
  try {
    const query = `SELECT * FROM kanbans WHERE type = 'context';`;
    db.all(query, [], (err, rows) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Failed to get contexts: " + err.message });
      }
      const contexts = rows.map((row) => {
        return {
          id: row.id,
          name: row.name,
          type: row.type,
          backlog_list_id: row.backlog_list_id,
          todo_list_id: row.todo_list_id,
          done_list_id: row.done_list_id,
        };
      });
      return res.status(200).json(contexts);
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getKanban = (req, res) => {
  const kanbanId = req.params.projectName;

  const query = `
  SELECT *
  FROM kanbans
  WHERE id = ?;
  `;

  db.all(query, [kanbanId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: "Failed to get backlog: " + err.message });
    } else {
      res.json(rows);
    }
  });
};

exports.getKanbanList = (req, res) => {
  const kanbanId = req.params.kanbanId;
  const listType = req.params.listType;

  const query = `
  SELECT t.*
  FROM tasks AS t
  JOIN task_list_association AS tla ON t.id = tla.task_id
  JOIN kanbans AS k ON tla.list_id = k.${listType}_list_id
  WHERE k.id = ?;
  `;
  db.all(query, [kanbanId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: "Failed to get backlog: " + err.message });
    } else {
      res.json(rows);
    }
  });
};

exports.createKanban = (req, res) => {
  const name = req.body.name;
  const type = req.body.type;

  if (type !== "project" && type !== "context") {
    res.status(500).json({ error: "Invalid kanban type" });
    return;
  }

  const query = `
  INSERT INTO kanbans (name, type)
  VALUES (?, ?);
  `;

  db.run(query, [name, type], (err) => {
    if (err) {
      res
        .status(500)
        .json({ error: "Failed to create kanban: " + err.message });
    } else {
      res.json({ success: true });
    }
  });
};