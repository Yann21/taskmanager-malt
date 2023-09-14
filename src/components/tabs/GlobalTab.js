import DroppableListWidget from "../list/DroppableListWidget";

export default function GlobalTab({ globalItems, setGlobalItems }) {
  return (
    <DroppableListWidget
      items={globalItems}
      setItems={setGlobalItems}
      setFocusedItem={() => {}}
      draggableType="global"
      canItemDelete={true}
      canItemAdd={false}
    />
  );
}
