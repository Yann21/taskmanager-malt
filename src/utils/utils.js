/**
 * Transfers an item from the source array to the destination array
 * @param {Array} source
 * @param {Array} destination
 * @param {Object} droppableSource {index: 0, droppableId: "backlog"}
 * @param {Object} droppableDestination {index: 2, droppableId: "backlog"}
 *
 */
export const moveItemBetweenLists = (
  source,
  destination,
  sourceIndex,
  destinationIndex
) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);

  const [removed] = sourceClone.splice(sourceIndex, 1);
  destClone.splice(destinationIndex, 0, removed);
  return {
    sourceArray: sourceClone,
    destinationArray: destClone,
  };
};
