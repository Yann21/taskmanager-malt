import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import ItemMenu from "./ItemMenu";
import axios from "axios";
import { Input } from "baseui/input";
import {
  createLinkedTaskDB,
  deleteTaskDB,
  updateTaskDB,
} from "../../apiService";
import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { createKanbanDB } from "../../apiService";
import { fetchProjectsDB } from "../../apiService";
import { fetchContextsDB } from "../../apiService";

const overflowStyle = {
  maxHeight: "68vh",
  overflowY: "auto",
};

const hoverColor = "#e6f7ff";
const activeColor = "#99c2ff";

const useItemHandlers = (items, setItems) => {
  const handleItemDeletion = (index) => {
    const taskId = items[index].id;
    deleteTaskDB(taskId);

    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleItemRenaming = (index, newName) => {
    const newItems = [...items];
    newItems[index].name = newName;
    setItems(newItems);
    // setEditableIndex(null);
  };

  /**
   * Creates a new item in the database and updates the UI
   * Can be used for inbox, projects, and contexts
   */
  const handleItemCreation = async (taskName, listName) => {
    // Update the UI
    const optimisticId = "1000";
    setItems([{ id: optimisticId, name: taskName }, ...items]);

    if (listName === "inbox") {
      const listId = 61; // TODO: Inbox magic
      const taskId = await createLinkedTaskDB(taskName, listId);
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === optimisticId ? { ...item, id: taskId } : item
        )
      );
    } else if (listName === "projects") {
      createKanbanDB(taskName, "project");
    } else if (listName === "contexts") {
      createKanbanDB(taskName, "context");
    }
  };

  return {
    handleItemDeletion,
    handleItemRenaming,
    handleItemCreation,
  };
};

const ItemInput = ({ inputItem, setInputItem, handleEnterPress }) => (
  <Input
    value={inputItem}
    onChange={(e) => setInputItem(e.target.value)}
    onKeyDown={handleEnterPress}
    placeholder="+ New Item"
  />
);

const getDraggableStyle = (index, activeIndex, isHovered, provided) => {
  return {
    userSelect: "none",
    padding: 16,
    margin: "8px 0",
    backgroundColor:
      index === activeIndex ? activeColor : isHovered ? hoverColor : "white",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    ...provided.draggableProps.style,
  };
};

const DraggableItem = (props) => {
  const {
    item,
    index,
    activeIndex,
    setActiveIndex,
    handleItemFocus,
    handleRightClick,
    canItemDelete,
    handleDelete,
    draggableType,
    listName,
  } = props;

  const [isEditing, setIsEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Draggable
      draggableId={item.id.toString()}
      index={index}
      type={draggableType}
    >
      {(provided) => (
        <div
          onContextMenu={(e) => handleRightClick(e, index)}
          key={index}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={getDraggableStyle(index, activeIndex, isHovered, provided)}
          onClick={async () => {
            setActiveIndex(index);

            if (listName === "projects") {
              const projects = await fetchProjectsDB();
              handleItemFocus(projects[index]);
            } else if (listName === "contexts") {
              const contexts = await fetchContextsDB();
              handleItemFocus(contexts[index]);
            }
          }}
          onMouseOver={() => {
            setIsHovered(true);
          }}
          onMouseLeave={() => {
            setIsHovered(false);
          }}
        >
          {isEditing ? (
            <input
              defaultValue={item.name}
              onBlur={(e) => {
                setIsEditing(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setIsEditing(false);
                }
              }}
              autoFocus
            />
          ) : (
            <div
              style={
                {
                  //flexGrow: 1,
                }
              }
              onClick={() => {
                setIsEditing(true);
              }}
            >
              {item.name}
            </div>
          )}

          {canItemDelete && (
            <button
              style={{ marginLeft: "auto" }}
              onClick={() => handleDelete(index)}
            >
              Delete
            </button>
          )}
        </div>
      )}
    </Draggable>
  );
};

function DroppableListWidget({
  items,
  setItems,
  setFocusedItem,
  listName,
  draggableType,
  canItemDelete = true,
  canItemAdd = true,
}) {
  const [rightClickedItem, setRightClickedItem] = useState(null);
  const [inputItem, setInputItem] = useState("");
  const [activeIndex, setActiveIndex] = useState(null);
  const [menuPosition, setMenuPosition] = useState(null);

  // Initialize selected item
  useEffect(() => {
    if (listName === "projects" || listName === "contexts") {
      setActiveIndex(0);
    }
  }, [listName]);

  const { handleItemDeletion, handleItemRenaming, handleItemCreation } =
    useItemHandlers(items, setItems);

  const handleItemFocus = (item) => {
    setFocusedItem(item);
  };

  /* ItemMenu */
  const handleItemRightClick = (event, index) => {
    event.preventDefault();
    setMenuPosition({
      top: event.clientY,
      left: event.clientX,
    });

    setRightClickedItem(items[index]);
  };

  const closeMenu = () => {
    setMenuPosition(null);
  };

  // TODO: Think about moving to parent item that would need to be created
  const moveItem = (targetProject) => {
    const sourceItem = rightClickedItem.name;

    // Optimistic UI update
    setItems(items.filter((item) => item.name !== sourceItem));

    // Reassign in the database
    updateTaskDB(sourceItem, targetProject);
  };

  return (
    <>
      {canItemAdd && (
        <ItemInput
          inputItem={inputItem}
          setInputItem={setInputItem}
          handleEnterPress={(e) => {
            if (e.key === "Enter") {
              handleItemCreation(inputItem, listName);
              setInputItem("");
            }
          }}
        />
      )}

      <div onClick={closeMenu}>
        <ItemMenu
          moveItem={moveItem}
          menuPosition={menuPosition}
          setMenuPosition={setMenuPosition}
        />
      </div>
      <Droppable droppableId={draggableType} type={draggableType}>
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={overflowStyle}
          >
            {items.map((item, index) => (
              <DraggableItem
                key={item.id}
                item={item}
                index={index}
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}
                handleItemFocus={handleItemFocus}
                handleRightClick={handleItemRightClick}
                canItemDelete={canItemDelete}
                handleDelete={handleItemDeletion}
                draggableType={draggableType}
                listName={listName}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </>
  );
}

DroppableListWidget.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  setItems: PropTypes.func.isRequired,
  setFocusedItem: PropTypes.func.isRequired,
  listName: PropTypes.string.isRequired,
  canItemDelete: PropTypes.bool,
  canItemAdd: PropTypes.bool,
};

export default DroppableListWidget;
