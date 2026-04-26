import { useNavigate } from 'react-router-dom';
import HistoryTable from '../components/HistoryTable';
import StatusBar from '../components/StatusBar';
import useHistory from '../hooks/UseHistory';

export default function HistoryPage() {
    const { files, error, handleDelete } = useHistory();
    const navigate = useNavigate();

    return (
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

                <HistoryTable files={files} onDelete={handleDelete} />
            </div>

            <StatusBar online={true} />
        </div>
    );
}