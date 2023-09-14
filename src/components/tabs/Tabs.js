import React, { useState, useEffect } from "react";
import { Tab, Tabs } from "baseui/tabs";
import ContextsTab from "./ContextsTab";
import ProjectsTab from "./ProjectsTab";
import GlobalTab from "./GlobalTab";
import { DragDropContext } from "react-beautiful-dnd";
import {
  fetchItems,
  fetchContextsDB,
  fetchGlobalItemsDB,
  fetchKanbanList,
  fetchProjectsDB,
} from "../../apiService";
import InboxTab from "./InboxTab";
import {
  associateTaskToListDB,
  disassociateTaskFromListDB,
} from "../../apiService";
import { moveItemBetweenLists } from "../../utils/utils";

const tabs = {
  0: "Inbox",
  1: "Global",
  2: "Projects",
  3: "Context",
};

const INBOX_LIST_ID = 61;


/**
 * Reorders an array of items moving the item at the startIndex to the endIndex.
 */
const reorder = (list, startIndex, endIndex) => {
  if (
    startIndex < 0 ||
    startIndex >= list.length ||
    endIndex < 0 ||
    endIndex >= list.length
  ) {
    console.warn("Invalid startIndex or endIndex");
    return list;
  }

  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const TabComponent = () => {
  const [activeKey, setActiveKey] = useState("0");
  const [inboxItems, setInboxItems] = useState([]);
  const [globalItems, setGlobalItems] = useState([]);
  const [projectItems, setProjectItems] = useState([]);
  const [projectKanbanLists, setProjectKanbanLists] = useState({
    backlog: [],
    todo: [],
    done: [],
  });
  const [contextItems, setContextItems] = useState([]);
  const [contextKanbanLists, setContextKanbanLists] = useState({
    backlog: [],
    todo: [],
    done: [],
  });

  const [focusedProject, setFocusedProject] = useState({});
  const [focusedContext, setFocusedContext] = useState({});

  // Sophisticated wrapper on setKanbanLists to update a specific list
  // while keeping the setter functionality of accepting a function
  const updateProjectKanbanList = (listId) => (newListOrUpdater) => {
    setProjectKanbanLists((prevState) => {
      // Check if newListOrUpdater is a function. If so, treat it as a updater function
      const updatedList =
        typeof newListOrUpdater === "function"
          ? newListOrUpdater(prevState[listId])
          : newListOrUpdater;

      return {
        ...prevState,
        [listId]: updatedList,
      };
    });
  };

  const updateContextKanbanList = (listId) => (newListOrUpdater) => {
    setContextKanbanLists((prevState) => {
      // Check if newListOrUpdater is a function. If so, treat it as a updater function
      const updatedList =
        typeof newListOrUpdater === "function"
          ? newListOrUpdater(prevState[listId])
          : newListOrUpdater;

      return {
        ...prevState,
        [listId]: updatedList,
      };
    });
  };

  // Initialize app
  useEffect(() => {
    initializeApp();
  }, []);

  // Update projects on tab change or focused project change
  useEffect(() => {
    refreshProjects();
  }, [focusedProject]);

  // Update contexts on tab change or focused context change
  useEffect(() => {
    refreshContexts();
  }, [focusedContext]);

  const initializeApp = async () => {
    handleTabChange({ activeKey: "0" });
    // Focus first project in DB
    const projects = await fetchProjectsDB();
    setFocusedProject(projects[0]);
    // Focus first context in DB
    const contexts = await fetchContextsDB();
    setFocusedContext(contexts[0]);
  };

  const fetchAndSetKanbanLists = async (id, setKanbanLists) => {
    const backlogItems = await fetchKanbanList(id, "backlog");
    const todoItems = await fetchKanbanList(id, "todo");
    const doneItems = await fetchKanbanList(id, "done");
    setKanbanLists({ backlog: backlogItems, todo: todoItems, done: doneItems });
  };

  const refreshContexts = async () => {
    const items = await fetchContextsDB();
    setContextItems(items.map((x) => ({ id: x.id.toString(), name: x.name })));
    fetchAndSetKanbanLists(focusedContext.id, setContextKanbanLists);
  };

  const refreshProjects = async () => {
    const projects = await fetchProjectsDB();
    setProjectItems(
      projects.map((x) => ({ id: x.id.toString(), name: x.name }))
    );
    await fetchAndSetKanbanLists(focusedProject.id, setProjectKanbanLists);
  };

  const handleTabChange = async ({ activeKey }) => {
    setActiveKey(activeKey);
    let activeTab = tabs[activeKey];

    switch (activeTab) {
      case "Inbox":
        // TODO: replace magic number
        const items = await fetchItems(61);
        setInboxItems(
          items.map((x) => ({ id: x.id.toString(), name: x.name }))
        );

        break;
      case "Global":
        const globalItems = await fetchGlobalItemsDB();
        setGlobalItems(globalItems);
        break;
      case "Projects":
        refreshProjects();
        break;
      case "Context":
        refreshContexts();
        break;
      default:
        console.log("Unknown tab");
    }
  };

  /**
   *
   * @param {source, destination} = result
   * @param source: {index: 0, droppableId: "backlog"}
   * @param destination: {index: 2, droppableId: "backlog"}
   * Where index is the position in the list
   */
  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    if (source.droppableId === "inbox") {
      const reorderedItems = reorder(
        inboxItems,
        source.index,
        destination.index
      );
      setInboxItems(reorderedItems);
    } else if (source.droppableId === "global") {
      const reorderedItems = reorder(
        globalItems,
        source.index,
        destination.index
      );
      setGlobalItems(reorderedItems);
    } else if (source.droppableId === "projects") {
      const reorderedItems = reorder(
        projectItems,
        source.index,
        destination.index
      );
      setProjectItems(reorderedItems);
    } else if (source.droppableId === "contexts") {
      const reorderedItems = reorder(
        contextItems,
        source.index,
        destination.index
      );
      setContextItems(reorderedItems);
    }
      // backlog, todo, done for both projects and contexts
    else if (source.droppableId.includes("project_")) {
      // Mechanism to differentiate between project and context by droppableId
      // either project_backlog, project_todo, or project_done
      const sourceColumnType = source.droppableId.split("_")[1];
      const destinationColumnType = destination.droppableId.split("_")[1];

      const sourceList = projectKanbanLists[sourceColumnType];
      const destinationList = projectKanbanLists[destinationColumnType];

      if (source.droppableId === destination.droppableId) {
        const reorderedItems = reorder(
          sourceList,
          source.index,
          destination.index
        );
        updateProjectKanbanList(sourceColumnType)(reorderedItems);
      } else {
        const { sourceArray, destinationArray } = moveItemBetweenLists(
          sourceList,
          destinationList,
          source.index,
          destination.index
        );
        updateProjectKanbanList(sourceColumnType)(
          sourceArray
        );
        updateProjectKanbanList(destinationColumnType)(
          destinationArray
        );

        const listName2ListId = {
          backlog: focusedProject.backlog_list_id,
          todo: focusedProject.todo_list_id,
          done: focusedProject.done_list_id,
        };
        console.log("Focused Project:", focusedProject);
        disassociateTaskFromListDB(
          sourceList[source.index].id,
          listName2ListId[sourceColumnType]
        );
        associateTaskToListDB(
          sourceList[source.index].id,
          listName2ListId[destinationColumnType]
        );
      }
    } else if (source.droppableId.includes("context_")) {
      // Mechanism to differentiate between project and context by droppableId
      // either context_backlog, context_todo, or context_done
      const sourceColumnType = source.droppableId.split("_")[1];
      const destinationColumnType = destination.droppableId.split("_")[1];

      const sourceList = contextKanbanLists[sourceColumnType];
      const destinationList = contextKanbanLists[destinationColumnType];

      if (sourceColumnType === destinationColumnType) {
        const reorderedItems = reorder(
          sourceList,
          source.index,
          destination.index
        );
        updateContextKanbanList(sourceColumnType)(reorderedItems);
      } else {
        const {sourceArray, destinationArray } = moveItemBetweenLists(
          sourceList,
          destinationList,
          source.index,
          destination.index
        );
        updateContextKanbanList(sourceColumnType)(
          sourceArray
        );
        updateContextKanbanList(destinationColumnType)(
          destinationArray
        );

        // TODO
        const listName2ListId = {
          backlog: focusedContext.backlog_list_id,
          todo: focusedContext.todo_list_id,
          done: focusedContext.done_list_id,
        };
        disassociateTaskFromListDB(
          sourceList[source.index].id,
          listName2ListId[sourceColumnType]
        );
        associateTaskToListDB(
          sourceList[source.index].id,
          listName2ListId[destinationColumnType]
        );
      }
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Tabs activeKey={activeKey} onChange={handleTabChange}>
        <Tab title="Inbox">
          <InboxTab inboxItems={inboxItems} setInboxItems={setInboxItems} />
        </Tab>

        <Tab title="Global">
          <GlobalTab
            globalItems={globalItems}
            setGlobalItems={setGlobalItems}
          />
        </Tab>

        <Tab title="Projects">
          <ProjectsTab
            projectItems={projectItems}
            setProjectItems={setProjectItems}
            setFocusedProject={setFocusedProject}
            projectKanbanLists={projectKanbanLists}
            updateProjectKanbanList={updateProjectKanbanList}
            focusedProject={focusedProject}
            setProjectKanbanLists={setProjectKanbanLists}
          />
        </Tab>

        <Tab title="Contexts">
          <ContextsTab
            contextItems={contextItems}
            setContextItems={setContextItems}
            setFocusedContext={setFocusedContext}
            contextKanbanLists={contextKanbanLists}
            focusedContext={focusedContext}
            updateContextKanbanList={updateContextKanbanList}
          />
        </Tab>
      </Tabs>
    </DragDropContext>
  );
};

export default TabComponent;
