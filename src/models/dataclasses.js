export class Task {
  constructor(id, name, description) {
    this.id = id;
    this.name = name;
    this.description = description;
  }
}

export class Kanban {
  constructor(id, name, type, backlog_list_id, todo_list_id, done_list_id) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.backlog_list_id = backlog_list_id;
    this.todo_list_id = todo_list_id;
    this.done_list_id = done_list_id;
  }
}

export class List {
  constructor(id, name, type) {
    this.id = id;
    this.name = name;
    this.type = type;
  }
}

export class TaskListAssociation {
  constructor(task_id, list_id) {
    this.task_id = task_id;
    this.list_id = list_id;
  }
}