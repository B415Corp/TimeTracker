import { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { DocumentBlock } from '@shared/types/document.types';
import { Plus, X } from 'lucide-react';

interface TableBlockProps {
  block: DocumentBlock;
  onUpdate: (blockId: string, content: any) => void;
  onDelete: (blockId: string) => void;
  onCreate: (blockId: string) => void;
  onFocus?: () => void;
}

interface TableCell {
  id: string;
  content: string;
}

interface TableRow {
  id: string;
  cells: TableCell[];
}

export const TableBlock = ({ block, onUpdate, onDelete, onCreate, onFocus }: TableBlockProps) => {
  const [rows, setRows] = useState<TableRow[]>(
    block.content?.rows || [
      {
        id: crypto.randomUUID(),
        cells: [
          { id: crypto.randomUUID(), content: '' },
          { id: crypto.randomUUID(), content: '' },
        ],
      },
      {
        id: crypto.randomUUID(),
        cells: [
          { id: crypto.randomUUID(), content: '' },
          { id: crypto.randomUUID(), content: '' },
        ],
      },
    ]
  );
  const [columns, setColumns] = useState<number>(
    block.content?.columns || 2
  );
  const [isFocused, setIsFocused] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const cellRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    if (block.content?.rows) {
      setRows(block.content.rows);
      setColumns(block.content.columns || block.content.rows[0]?.cells.length || 2);
    }
  }, [block.content]);

  const handleCellInput = (rowId: string, cellId: string, newContent: string) => {
    const newRows = rows.map((row) =>
      row.id === rowId
        ? {
            ...row,
            cells: row.cells.map((cell) =>
              cell.id === cellId ? { ...cell, content: newContent } : cell
            ),
          }
        : row
    );
    setRows(newRows);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      onUpdate(block.block_id, { rows: newRows, columns });
    }, 300);
  };

  const handleCellKeyDown = (
    e: KeyboardEvent<HTMLDivElement>,
    rowId: string,
    cellId: string,
    rowIndex: number,
    cellIndex: number
  ) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const nextCellIndex = e.shiftKey ? cellIndex - 1 : cellIndex + 1;
      
      if (nextCellIndex < 0) {
        // Move to previous row
        if (rowIndex > 0) {
          const prevRow = rows[rowIndex - 1];
          const prevCell = prevRow.cells[prevRow.cells.length - 1];
          const prevCellRef = cellRefs.current[prevCell.id];
          if (prevCellRef) {
            prevCellRef.focus();
          }
        }
      } else if (nextCellIndex >= rows[rowIndex].cells.length) {
        // Move to next row
        if (rowIndex < rows.length - 1) {
          const nextRow = rows[rowIndex + 1];
          const nextCell = nextRow.cells[0];
          const nextCellRef = cellRefs.current[nextCell.id];
          if (nextCellRef) {
            nextCellRef.focus();
          }
        } else {
          // Create new row
          addRow();
        }
      } else {
        // Move to next/prev cell in same row
        const targetCell = rows[rowIndex].cells[nextCellIndex];
        const targetCellRef = cellRefs.current[targetCell.id];
        if (targetCellRef) {
          targetCellRef.focus();
        }
      }
    }

    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      addRow();
    }
  };

  const addRow = () => {
    const newRow: TableRow = {
      id: crypto.randomUUID(),
      cells: Array.from({ length: columns }, () => ({
        id: crypto.randomUUID(),
        content: '',
      })),
    };
    const newRows = [...rows, newRow];
    setRows(newRows);
    onUpdate(block.block_id, { rows: newRows, columns });
    
    // Focus first cell of new row
    setTimeout(() => {
      const firstCellRef = cellRefs.current[newRow.cells[0].id];
      if (firstCellRef) {
        firstCellRef.focus();
      }
    }, 0);
  };

  const addColumn = () => {
    const newColumns = columns + 1;
    const newRows = rows.map((row) => ({
      ...row,
      cells: [
        ...row.cells,
        { id: crypto.randomUUID(), content: '' },
      ],
    }));
    setRows(newRows);
    setColumns(newColumns);
    onUpdate(block.block_id, { rows: newRows, columns: newColumns });
  };

  const removeColumn = (columnIndex: number) => {
    if (columns <= 1) return;
    const newRows = rows.map((row) => ({
      ...row,
      cells: row.cells.filter((_, idx) => idx !== columnIndex),
    }));
    setRows(newRows);
    const newColumns = columns - 1;
    setColumns(newColumns);
    onUpdate(block.block_id, { rows: newRows, columns: newColumns });
  };

  const removeRow = (rowId: string) => {
    if (rows.length <= 1) {
      onDelete(block.block_id);
      return;
    }
    const newRows = rows.filter((row) => row.id !== rowId);
    setRows(newRows);
    onUpdate(block.block_id, { rows: newRows, columns });
  };

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <div className={`relative group ${isFocused ? 'ring-1 ring-blue-200' : ''}`}>
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {rows[0]?.cells.map((_, colIndex) => (
                <th
                  key={colIndex}
                  className="border border-gray-200 dark:border-gray-700 p-2 relative group/header"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      Column {colIndex + 1}
                    </span>
                    {columns > 1 && (
                      <button
                        onClick={() => removeColumn(colIndex)}
                        className="opacity-0 group-hover/header:opacity-100 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </th>
              ))}
              <th className="border border-gray-200 dark:border-gray-700 p-2 w-8">
                <button
                  onClick={addColumn}
                  className="w-full h-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                  title="Add column"
                >
                  <Plus className="w-4 h-4 text-gray-400" />
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={row.id} className="group/row">
                {row.cells.map((cell, cellIndex) => (
                  <td
                    key={cell.id}
                    className="border border-gray-200 dark:border-gray-700 p-2 min-w-[100px]"
                  >
                    <div
                      ref={(el) => (cellRefs.current[cell.id] = el)}
                      contentEditable
                      onInput={(e) =>
                        handleCellInput(row.id, cell.id, e.currentTarget.textContent || '')
                      }
                      onKeyDown={(e) =>
                        handleCellKeyDown(e, row.id, cell.id, rowIndex, cellIndex)
                      }
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      className="min-h-[1.5rem] outline-none text-sm text-gray-900 dark:text-gray-100"
                      suppressContentEditableWarning
                    >
                      {cell.content}
                    </div>
                  </td>
                ))}
                <td className="border border-gray-200 dark:border-gray-700 p-2 w-8">
                  <div className="flex items-center gap-1 opacity-0 group-hover/row:opacity-100">
                    <button
                      onClick={() => removeRow(row.id)}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                      title="Remove row"
                    >
                      <X className="w-3 h-3 text-gray-400" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="border-t border-gray-200 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-800">
          <button
            onClick={addRow}
            className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
          >
            <Plus className="w-4 h-4" />
            Add row
          </button>
        </div>
      </div>
    </div>
  );
};
