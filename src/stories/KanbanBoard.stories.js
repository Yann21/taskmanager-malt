import KanbanBoard from "../components/kanban/KanbanBoard";

export default {
  title: "KanbanBoard",
  component: KanbanBoard,
};

export const primary = () => (
  <KanbanBoard
    kanbanLists={{
      backlog: [
        { id: "1", name: "backlog item 1" },
        { id: "2", name: "backlog item 2" },
      ],
      todo: [{ id: "3", name: "todo item 1" }],
      done: [],
    }}
    setKanbanLists={() => {}}
    focusedProject={{
      id: 2,
      name: "iso",
      type: "project",
      backlog_list_id: 4,
      todo_list_id: 5,
      done_list_id: 6,
    }}
  />
);
