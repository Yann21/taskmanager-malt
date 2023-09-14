import KanbanBoard from "../kanban/KanbanBoard";
import { Tab } from "baseui/tabs";
import DroppableListWidget from "../list/DroppableListWidget";

export default function ContextsTab({
  contextItems,
  setContextItems,
  setFocusedContext,
  contextKanbanLists,
  focusedContext,
  updateContextKanbanList,
}) {
  const projectContainerStyle = { display: "flex" };
  const projectsContaineeStyle = {
    flex: "1",
    maxWidth: "300px",
    marginRight: "20px",
  };
  const kanbanContaineeStyle = { flex: "1" };

  return (
    <div style={projectContainerStyle}>
      <div style={projectsContaineeStyle}>
        <h2>Contexts</h2>
        <DroppableListWidget
          items={contextItems}
          setItems={setContextItems}
          setFocusedItem={setFocusedContext}
          listName="contexts"
          draggableType="contexts"
        />
      </div>
      <div style={kanbanContaineeStyle}>
        <KanbanBoard
          kanbanLists={contextKanbanLists}
          updateKanbanList={updateContextKanbanList}
          focusedProject={focusedContext}
          kanbanType="context"
        />
      </div>
    </div>
  );
}
