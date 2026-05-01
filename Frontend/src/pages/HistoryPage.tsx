import { useNavigate } from 'react-router-dom';
import HistoryTable from '../components/HistoryTable';
import StatusBar from '../components/StatusBar';
import useHistory from '../hooks/UseHistory';
import ConfirmDialog from '../components/ConfirmDialogue';
import { useState } from 'react';

export default function HistoryPage() {
    const { files, error, handleDelete } = useHistory();
    const navigate = useNavigate();
    const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

    const onDeleteClick = (id: string) => setPendingDeleteId(id);

    const onConfirm = async () => {
        if (!pendingDeleteId) return;
        const id = pendingDeleteId;
        setPendingDeleteId(null);
        await handleDelete(id);
    };

    const onCancel = () => setPendingDeleteId(null);

    return (
        <>
            {pendingDeleteId && (
                <ConfirmDialog
                    message="Are you sure you want to delete this file? This action cannot be undone."
                    onConfirm={onConfirm}
                    onCancel={onCancel}
                />
            )}
            <div className="max-w-5xl mx-auto my-8 bg-paper border-2 border-border-strong shadow-[6px_6px_0_#bbb,12px_12px_0_#ddd]">
                <div className="px-10 py-9">
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-2xl font-black text-text-primary border-b border-dashed border-border-lighter pb-2">
                            Upload History
                        </h1>
                        <button
                            onClick={() => navigate('/upload')}
                            className="px-8 py-2.5 text-base font-black text-white bg-btn-primary border-2 border-btn-primary shadow-[4px_4px_0_#555] cursor-pointer"
                        >
                            New Upload
                        </button>
                    </div>

                    {error && <p className="text-accent text-sm mb-4">{error}</p>}

                    <HistoryTable files={files} onDelete={onDeleteClick} />
                </div>

                <StatusBar online={true} />
            </div>
        </>
    );
}