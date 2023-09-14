import DroppableList from "../components/kanban/DroppableList";

export default {
  title: "DroppableList",
  component: DroppableList,
};

export const primary = () => (
  <DroppableList
    droppableId={1}
    listName="backlog"
    listIdDB={12}
    items={[
      { id: "1", name: "backlog item 1" },
      { id: "2", name: "backlog item 2" },
    ]}
    setItems={() => {}}
  />
);
