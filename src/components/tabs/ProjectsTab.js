import KanbanBoard from "../kanban/KanbanBoard";
import DroppableListWidget from "../list/DroppableListWidget";

export default function ProjectsTab({
  projectItems,
  setProjectItems,
  setFocusedProject,
  projectKanbanLists,
  updateProjectKanbanList,
  focusedProject,
}) {
  console.log("inside projectsTab: kanbanLists", projectKanbanLists["backlog"]);

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
        <h2>Projects</h2>
        <DroppableListWidget
          items={projectItems}
          setItems={setProjectItems}
          listName="projects"
          draggableType="projects"
          setFocusedItem={setFocusedProject}
        />
      </div>
      <div style={kanbanContaineeStyle}>
        <KanbanBoard
          kanbanLists={projectKanbanLists}
          updateKanbanList={updateProjectKanbanList}
          focusedProject={focusedProject}
          kanbanType="project"
        />
      </div>
    </div>
  );
}
