// Grid lines are drawn with a background-color trick: the grid container has
// bg-primary-01 (gray) and gap-px, while every real cell paints bg-primary-03
// (white) over its own area, so only the 1px gaps show through as lines. When
// a list doesn't fill a full row, the leftover tracks have no cell to paint
// them, so the container's gray shows through solid. GridFillers paints those
// leftover tracks white so it keeps working no matter how many items a CMS
// ends up sending.
export const getFillerCount = (itemCount, cols) =>
  (cols - (itemCount % cols)) % cols;

const GridFillers = ({ items, cols }) => {
  const count = getFillerCount(items.length, cols);
  return Array.from({ length: count }, (_, index) => (
    <div key={`filler-${index}`} className="bg-primary-03" />
  ));
};

export default GridFillers;
