import GridCross, { hasTopCross } from "./GridCross";

// Grid lines are drawn with a background-color trick: the grid container has
// bg-primary-01 (gray) and gap-px, while every real cell paints bg-primary-03
// (white) over its own area, so only the 1px gaps show through as lines. When
// a list doesn't fill a full row, the leftover tracks have no cell to paint
// them, so the container's gray shows through solid. GridFillers paints those
// leftover tracks white so it keeps working no matter how many items a CMS
// ends up sending.
//
// minRows: además de completar la última fila, agrega celdas vacías hasta
// llegar a esa cantidad de filas (para que la grilla llene la pantalla aunque
// haya pocos items). crosses: dibuja las cruces en las intersecciones de las
// celdas de relleno, igual que en las celdas con contenido.
export const getFillerCount = (itemCount, cols, minRows = 0) =>
  Math.max((cols - (itemCount % cols)) % cols, minRows * cols - itemCount);

const GridFillers = ({ items, cols, minRows = 0, crosses = false }) => {
  const count = getFillerCount(items.length, cols, minRows);
  return Array.from({ length: count }, (_, index) => (
    <div key={`filler-${index}`} className="relative bg-primary-03">
      {crosses && hasTopCross(items.length + index, cols) && <GridCross />}
    </div>
  ));
};

export default GridFillers;
