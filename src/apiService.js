import axios from "axios";

/** /api/tasks */
export const createTaskDB = async (taskName) => {
  return await axios.post("/api/tasks/", { taskName });
};

export const deleteTaskDB = async (taskId) => {
  return await axios.delete(`/api/tasks/${taskId}`);
};

export const fetchGlobalItemsDB = async () => {
  const response = await axios.get("/api/tasks/todo");
  return response.data.map((x, i) => ({ id: i.toString(), name: x }));
};

export const updateTaskDB = async (sourceItem, targetProject) => {
  return await axios.put("/api/tasks/", { sourceItem, targetProject });
};


/** /api/lists */
export const fetchItems = async (listId) => {
  const response = await axios.get(`/api/lists/${listId}/tasks`);
  return response.data;
};

export const disassociateTaskFromListDB = async (taskId, listId) => {
  return await axios.delete(`/api/lists/${listId}/tasks/${taskId}/associate`);
};

export const associateTaskToListDB = async (taskId, listId) => {
  return await axios.post(`/api/lists/${listId}/tasks/${taskId}/associate`);
};

export const createLinkedTaskDB = async (taskName, listId) => {
  const res = await createTaskDB(taskName);
  const taskId = res.data.id;
  await associateTaskToListDB(taskId, listId);
  return taskId;
};

export const fetchListDB = async (listId) => {
  const response = await axios.get(`/api/lists/${listId}`);
  return response.data;
};

/** /api/kanbans */
export const fetchBacklogDB = async (kanbanId) => {
  const response = await axios.get(`/api/kanbans/${kanbanId}/backlog`);
  return response.data.map((x, i) => ({ id: i.toString(), content: x }));
};

export const fetchKanbanList = async (kanbanId, listType) => {
  if (!["backlog", "todo", "done"].includes(listType)) {
    throw new Error("listType must be one of 'backlog', 'todo', or 'done'");
  }

  const response = await axios.get(
    `/api/kanbans/${kanbanId}/lists/${listType}/tasks`
  );
  return response.data;
};

export const fetchDoneDB = async (kanbanId) => {
  const response = await axios.get(`/api/kanbans/${kanbanId}/done`);
  return response.data.map((x, i) => ({ id: i.toString(), content: x }));
};

export const getListIdsFromKanbanDB = async (kanbanId) => {
  const response = await axios.get(`/api/kanbans/${kanbanId}`);
  return response.data;
};

export const fetchProjectsDB = async () => {
  const response = await axios.get("/api/kanbans/type/projects");
  return response.data;
};

export const fetchContextsDB = async () => {
  const response = await axios.get("/api/kanbans/type/contexts");
  return response.data;
};

export const createKanbanDB = async (name, type) => {
  return await axios.post("/api/kanbans/", { name, type });
};
