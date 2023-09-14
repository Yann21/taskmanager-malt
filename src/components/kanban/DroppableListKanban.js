import React, { useState } from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { Checkbox, LABEL_PLACEMENT } from "baseui/checkbox";
import { Input } from "baseui/input";
import { createLinkedTaskDB, deleteTaskDB } from "../../apiService";
import PropTypes from "prop-types";

const grid = 8;
const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? "lightgrey" : "transparent",
  padding: grid,
  width: "300px",
  maxHeight: "68vh",
  overflowY: "auto",
});

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0px`,
  background: isDragging ? "white" : "white",
  ...draggableStyle,
});

// Task Input Component
const TaskInput = ({ value, onChange, onKeyDown }) => (
  <Input
    value={value}
    onChange={onChange}
    onKeyDown={onKeyDown}
    placeholder="New Task"
    overrides={{
      Root: {
        style: {
          backgroundColor: "white",
          width: "300px",
        },
      },
      Input: {
        style: { backgroundColor: "white" },
      },
    }}
  />
);

// Task Item Component
const TaskItem = ({ item, isItemChecked, handleCheckItem, index }) => {
  return (
    <Draggable draggableId={item.id.toString()} index={index} type="KANBAN">
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={getItemStyle(
            snapshot.isDragging,
            provided.draggableProps.style
          )}
        >
          <Checkbox
            labelPlacement={LABEL_PLACEMENT.right}
            checked={isItemChecked(item.id.toString())}
            onChange={() => handleCheckItem(item.id.toString())}
          >
            {item.name}
          </Checkbox>
        </div>
      )}
    </Draggable>
  );
};

const DroppableListKanban = ({
  droppableId,
  listName,
  listIdDB,
  items,
  setItems,
}) => {
  const [todoTask, setTask] = useState("");
  const [checkedItems, setCheckedItems] = useState({});

  const handleEnterPress = async (event) => {
    if (event.key === "Enter" && event.target.value.trim()) {
      const taskName = event.target.value;

      // Update the UI
      setItems([{ id: items.length.toString(), name: taskName }, ...items]);
      setTask("");

      // Create the task in the database
      createLinkedTaskDB(taskName, listIdDB);
    }
  };

  const handleCheckItem = (taskId) => {
    // Toggle the checkbox (animation)
    setCheckedItems((prevState) => ({
      ...prevState,
      [taskId]: !prevState[taskId],
    }));

    // Timeout to let the animation finish
    setTimeout(() => {
      // Remove the item from the UI
      setItems((prevItems) => prevItems.filter((item) => item.id !== +taskId));

      // Clean up the checkbox boolean state
      setCheckedItems((prevState) => {
        delete prevState[taskId];
        return prevState;
      });
    }, 200);

    // Remove task from the database
    deleteTaskDB(taskId);
  };

  const isItemChecked = (itemId) => !!checkedItems[itemId];

  return (
    <div>
      <h2>{listName}</h2>
      <TaskInput
        value={todoTask}
        onChange={(event) => setTask(event.target.value)}
        onKeyDown={handleEnterPress}
      />
      <Droppable droppableId={droppableId} type="KANBAN">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            style={getListStyle(snapshot.isDraggingOver)}
          >
            {items.map((item, index) => (
              <TaskItem
                key={item.id}
                item={item}
                index={index}
                isItemChecked={isItemChecked}
                handleCheckItem={handleCheckItem}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

DroppableListKanban.propTypes = {
  droppableId: PropTypes.string.isRequired,
  listName: PropTypes.string.isRequired,
  listIdDB: PropTypes.number.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  setItems: PropTypes.func.isRequired,
};

export default DroppableListKanban;
