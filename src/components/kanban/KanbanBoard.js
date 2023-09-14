import React from "react";
import DroppableListKanban from "./DroppableListKanban";
import PropTypes from "prop-types";

const KanbanBoard = ({
  kanbanLists,
  kanbanType,
  updateKanbanList,
  focusedProject,
}) => {
  const dragDropContextStyle = {
    display: "flex",
  };

  const droppableListStyle = {
    flex: "1",
  };

  // debugger;

  const droppableConfigs = [
    { id: `${kanbanType}_backlog`, columnType: "backlog", name: "Backlog", listId: focusedProject.backlog_list_id },
    { id: `${kanbanType}_todo`, columnType: "todo", name: "TODO", listId: focusedProject.todo_list_id },
    { id: `${kanbanType}_done`, columnType: "done", name: "DONE", listId: focusedProject.done_list_id },
  ];

  return (
    <div style={dragDropContextStyle}>
      {droppableConfigs.map((config) => (
        <div key={config.id} style={droppableListStyle}>
          <DroppableListKanban
            droppableId={config.id}
            listName={config.name}
            listIdDB={config.listId}
            projectName={focusedProject}
            items={kanbanLists[config.columnType]}
            setItems={updateKanbanList(config.columnType)}
          />
        </div>
      ))}
    </div>
  );
};

KanbanBoard.propTypes = {
  kanbanLists: PropTypes.object.isRequired,
  updateKanbanList: PropTypes.func.isRequired,
  focusedProject: PropTypes.object.isRequired,
};

export default KanbanBoard;
