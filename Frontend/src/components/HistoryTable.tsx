import type { HistoryFile } from '../services/HistoryService';
import HistoryRow from './HistoryRow';

const COLUMNS = ['Sr. No.', 'Name', 'Type', 'Uploaded At', 'Status', 'Actions'];

interface HistoryTableProps {
    files: HistoryFile[];
    onDelete: (id: string) => void;
}

export default function HistoryTable({ files, onDelete }: HistoryTableProps) {
    return (
        <div className="border-2 border-border-strong overflow-x-auto">
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-btn-primary text-white">
                        {COLUMNS.map((col) => (
                            <th key={col} className="px-4 py-3 text-left text-sm font-bold">
                                {col}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {files.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="px-4 py-8 text-center text-text-muted-3 text-sm">
                                No files uploaded yet.
                            </td>
                        </tr>
                    ) : (
                        files.map((file, index) => (
                            <HistoryRow key={file.id} file={file} index={index} onDelete={onDelete} />
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}