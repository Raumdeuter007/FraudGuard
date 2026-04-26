
import { Trash2, Eye } from 'lucide-react';
import type { HistoryFile } from '../services/HistoryService';
import { useNavigate } from 'react-router-dom';

interface HistoryRowProps {
    file: HistoryFile;
    index: number;
    onDelete: (id: string) => void;
}

export default function HistoryRow({ file, index, onDelete }: HistoryRowProps) {
    const navigate = useNavigate();

    const formattedDate = new Date(file.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <tr
            className="border-b border-border-lighter hover:bg-upload-bg transition-colors cursor-pointer"
            onClick={() => navigate(`/results/${file.id}`)}
        >
            <td className="px-4 py-3 text-sm text-text-muted-2">{index + 1}</td>
            <td className="px-4 py-3 text-sm text-text-primary font-medium max-w-200px truncate">{file.name}</td>
            <td className="px-4 py-3 text-sm text-text-muted-2">{file.mime_type}</td>
            <td className="px-4 py-3 text-sm text-text-muted-2">{formattedDate}</td>
            <td className="px-4 py-3">
                <span className="text-xs font-semibold px-2 py-0.5 border border-border-light text-text-muted-2 bg-paper">
                    Pending
                </span>
            </td>
            <td
                className="px-4 py-3"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate(`/results/${file.id}`)}
                        className="text-text-muted-2 hover:text-text-primary cursor-pointer"
                    >
                        <Eye size={16} />
                    </button>
                    <button
                        onClick={() => onDelete(file.id)}
                        className="text-text-muted-2 hover:text-accent cursor-pointer"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </td>
        </tr>
    );
}