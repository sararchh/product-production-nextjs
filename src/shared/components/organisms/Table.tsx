import React, { ReactNode } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export interface TableColumn<T = unknown> {
  key: string;
  label: string;
  width?: string;
  className?: string;
  render?: (item: T, index: number) => ReactNode;
  sortable?: boolean;
}

export interface TableProps<T = unknown> {
  data: T[];
  columns: TableColumn<T>[];
  isLoading?: boolean;
  error?: string | null;
  emptyMessage?: string;
  className?: string;
  striped?: boolean;
  hoverable?: boolean;
  bordered?: boolean;
  compact?: boolean;
  stickyHeader?: boolean;
  loadingMessage?: string;
  errorMessage?: string;
  rowClassName?: (item: T, index: number) => string;
  onRowClick?: (item: T, index: number) => void;
  rowKey?: (item: T) => string | number;
}

export const Table = <T = Record<string, unknown>,>({
  data,
  columns,
  isLoading = false,
  error = null,
  emptyMessage = "Nenhum item encontrado",
  className = "",
  striped = true,
  hoverable = true,
  bordered = true,
  compact = false,
  stickyHeader = false,
  loadingMessage = "Carregando...",
  errorMessage = "Erro ao carregar dados",
  rowClassName,
  onRowClick,
  rowKey,
}: TableProps<T>) => {
  const getRowKey = (item: T, index: number): string | number => {
    if (rowKey) return rowKey(item);
    if (typeof item === "object" && item !== null && "id" in item) {
      const id = (item as Record<string, unknown>).id;
      if (typeof id === "string" || typeof id === "number") {
        return id;
      }
    }
    return index;
  };

  const getRowClassName = (item: T, index: number): string => {
    let classes = "";

    if (striped) {
      classes += index % 2 === 0 ? "bg-white" : "bg-gray-50";
    }

    if (hoverable) {
      classes += " hover:bg-gray-100";
    }

    if (onRowClick) {
      classes += " cursor-pointer";
    }

    if (rowClassName) {
      classes += " " + rowClassName(item, index);
    }

    return classes;
  };

  const tableClasses = `
    min-w-full divide-y divide-gray-200
    ${bordered ? "border border-gray-200" : ""}
    ${compact ? "text-sm" : ""}
  `.trim();

  const containerClasses = `
    overflow-hidden
    ${stickyHeader ? "max-h-96 overflow-y-auto" : ""}
    ${className}
  `.trim();

  const headerClasses = `
    bg-gray-50
    ${stickyHeader ? "sticky top-0 z-10" : ""}
  `.trim();

  const cellClasses = `
    px-6 py-4 whitespace-nowrap text-sm
    ${compact ? "px-3 py-2" : ""}
  `.trim();

  const headerCellClasses = `
    px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider
    ${compact ? "px-3 py-2" : ""}
  `.trim();

  if (isLoading) {
    return (
      <div className={containerClasses}>
        <table className={tableClasses}>
          <thead className={headerClasses}>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`${headerCellClasses} ${column.className || ""}`}
                  style={column.width ? { width: column.width } : undefined}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td colSpan={columns.length} className="px-6 py-4 text-center">
                <div className="flex justify-center items-center space-x-2">
                  <AiOutlineLoading3Quarters className="animate-spin h-6 w-6 text-blue-600" />
                  <span className="text-gray-600">{loadingMessage}</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  if (error) {
    return (
      <div className={containerClasses}>
        <table className={tableClasses}>
          <thead className={headerClasses}>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`${headerCellClasses} ${column.className || ""}`}
                  style={column.width ? { width: column.width } : undefined}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-4 text-center text-red-600"
              >
                {errorMessage}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={containerClasses}>
        <table className={tableClasses}>
          <thead className={headerClasses}>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`${headerCellClasses} ${column.className || ""}`}
                  style={column.width ? { width: column.width } : undefined}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-4 text-center text-gray-700"
              >
                {emptyMessage}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      <table className={tableClasses}>
        <thead className={headerClasses}>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`${headerCellClasses} ${column.className || ""}`}
                style={column.width ? { width: column.width } : undefined}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item, index) => (
            <tr
              key={getRowKey(item, index)}
              className={getRowClassName(item, index)}
              onClick={onRowClick ? () => onRowClick(item, index) : undefined}
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={`${cellClasses} ${column.className || ""}`}
                  style={column.width ? { width: column.width } : undefined}
                >
                  {column.render
                    ? column.render(item, index)
                    : ((item as Record<string, unknown>)[
                        column.key
                      ] as ReactNode) || "-"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
