import DroppableListWidget from "../list/DroppableListWidget";

export default function InboxTab({ inboxItems, setInboxItems }) {
  return (
    <DroppableListWidget
      items={inboxItems}
      setItems={setInboxItems}
      listName="inbox"
      draggableType="inbox"
      setFocusedItem={() => {}}
    />
  );
}
