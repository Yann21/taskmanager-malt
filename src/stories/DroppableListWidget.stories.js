import DroppableListWidget from "../components/list/DroppableListWidget";

export default {
  title: "DroppableListWidget",
  component: DroppableListWidget,
};

export const primary = () => (
  <DroppableListWidget
    items={[
      { id: "1", name: "backlog item 1" },
      { id: "2", name: "backlog item 2" },
    ]}
    setItems={() => {}}
    setFocusedItem={() => {}}
    listName="backlog"
    canItemDelete={true}
    canItemAdd={true}
  />
);
