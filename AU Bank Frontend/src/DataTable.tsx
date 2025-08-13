// components/DataTable.tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface TableData {
  [key: string]: string | number
}

interface DataTableProps {
  title?: string
  headers: string[]
  data: TableData[]
  cellColors?: { [key: string]: string } // optional background colors per column
}

export default function DataTable({
  title,
  headers,
  data,
  cellColors,
}: DataTableProps) {
  return (
    <div className="bg-card text-card-foreground shadow-md p-[20px]">
      {title && (
        <h2 className="dark:text-white text-black text-lg font-semibold mb-3">
          {title}
        </h2>
      )}
      <Table className="border-separate border-spacing-y-2">
        <TableHeader>
          <TableRow className="border-none">
            {headers.map((header, idx) => (
              <TableHead
                key={idx}
                className="dark:text-white text-black"
              >
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, rowIdx) => (
            <TableRow key={rowIdx} className="border-none">
              {headers.map((header, colIdx) => {
                const key = Object.keys(row)[colIdx]
                const bgColor = cellColors?.[key] || ""
                return (
                  <TableCell
                    key={colIdx}
                    className={`text-black font-medium ${colIdx === headers.length - 1 ? "text-right font-semibold" : ""}`}
                    style={{
                      padding: "8px 12px",
                      backgroundColor: bgColor,
                    }}
                  >
                    {row[key]}
                  </TableCell>
                )
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
