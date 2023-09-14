import DroppableListKanban from "../components/kanban/DroppableListKanban";
import { DragDropContext } from "react-beautiful-dnd";

export default {
  title: "DroppableListKanban",
  component: DroppableListKanban,
};

export const primary = () => (
  <DragDropContext>
    <DroppableListKanban
      droppableId={1}
      listName="backlog"
      listIdDB={12}
      items={[
        { id: "1", name: "backlog item 1" },
        { id: "2", name: "backlog item 2" },
      ]}
      setItems={() => {}}
    />
  </DragDropContext>
);
