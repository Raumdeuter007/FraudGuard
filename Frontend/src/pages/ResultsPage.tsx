import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useResults from '../hooks/UseResults';
import StatusBar from '../components/StatusBar';

type ViewMode = 'both' | 'original' | 'heatmap';

export default function ResultsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { result, error } = useResults(id);
    const [viewMode, setViewMode] = useState<ViewMode>('both');

    if (error) {
        return (
            <div className="max-w-3xl mx-auto my-8 bg-paper border-2 border-border-strong px-10 py-12 text-center">
                <p className="text-accent font-bold mb-4">{error}</p>
                <button onClick={() => navigate('/history')} className="text-sm font-black underline text-text-primary">
                    ← Back to History
                </button>
            </div>
        );
    }

    if (!result) return null;

    const scan = result.scan;
    const isTampered = scan?.is_tampered ?? false;
    const tamperPercent = ((scan?.tamper_percent ?? 0) * 100).toFixed(2);
    const scanDuration = scan
        ? Math.round((new Date(scan.completed_at).getTime() - new Date(scan.started_at).getTime()) / 1000)
        : null;

    const gridCols = viewMode === 'both' ? 'grid-cols-2' : 'grid-cols-1';

    return (
        <div className="max-w-5xl mx-auto my-8 bg-paper border-2 border-border-strong shadow-[6px_6px_0_#bbb,12px_12px_0_#ddd]">
            <div className="px-10 py-9">

                {/* Verdict bar */}
                <div className={`flex items-center justify-between px-6 py-4 border-2 mb-6
                    ${isTampered ? 'border-accent bg-red-50' : 'border-status-online bg-green-50'}`}>
                    <div className="flex items-center gap-4">
                        <div className={`w-9 h-9 border-2 flex items-center justify-center font-black text-lg
                            ${isTampered ? 'border-accent text-accent' : 'border-status-online text-status-online'}`}>
                            {isTampered ? '✕' : '✓'}
                        </div>
                        <div>
                            <p className={`text-xl font-black ${isTampered ? 'text-accent' : 'text-status-online'}`}>
                                {isTampered ? 'TAMPERED' : 'AUTHENTIC'}
                            </p>
                            <p className="text-xs text-text-muted-3 mt-0.5">
                                {isTampered
                                    ? 'Document shows signs of pixel-level manipulation'
                                    : 'No signs of tampering detected'}
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-3xl font-black text-text-primary">{tamperPercent}%</p>
                        <p className="text-xs text-text-muted-3">tampered area</p>
                    </div>
                </div>

                {/* View toggle */}
                <div className="flex gap-2 mb-4">
                    {(['both', 'original', 'heatmap'] as ViewMode[]).map((mode) => (
                        <button
                            key={mode}
                            onClick={() => setViewMode(mode)}
                            className={`text-sm font-semibold px-4 py-1.5 border-2 border-border-strong cursor-pointer capitalize
                                ${viewMode === mode ? 'bg-btn-primary text-white' : 'bg-transparent text-text-primary'}`}
                        >
                            {mode === 'both' ? 'Side by Side' : mode === 'original' ? 'Original Only' : 'Heatmap Only'}
                        </button>
                    ))}
                </div>

                {/* Images */}
                <div className={`grid ${gridCols} gap-4 mb-6`}>
                    {viewMode !== 'heatmap' && (
                        <div className="border-2 border-border-strong">
                            <div className="px-4 py-2 border-b-2 border-border-strong bg-navbar-bg flex items-center justify-between">
                                <span className="text-sm font-bold text-text-primary">Original Document</span>
                                <span className="text-xs text-text-muted-3">{result.mime_type}</span>
                            </div>
                            <div className="p-3 bg-upload-bg flex items-center justify-center min-h-56">
                                <img src={result.url} alt="Original" className="max-w-full max-h-56 object-contain" />
                            </div>
                        </div>
                    )}
                    {viewMode !== 'original' && scan?.heatmap_url && (
                        <div className="border-2 border-border-strong">
                            <div className="px-4 py-2 border-b-2 border-border-strong bg-navbar-bg flex items-center justify-between">
                                <span className="text-sm font-bold text-text-primary">Tampering Heatmap</span>
                                <span className="text-xs text-accent font-semibold">Regions highlighted</span>
                            </div>
                            <div className="p-3 bg-upload-bg flex items-center justify-center min-h-56">
                                <img src={scan.heatmap_url} alt="Heatmap" className="max-w-full max-h-56 object-contain" />
                            </div>
                        </div>
                    )}
                </div>

                {/* Meta */}
                <div className="border-2 border-border-strong divide-y divide-border-lighter mb-6">
                    <div className="grid grid-cols-4 divide-x divide-border-lighter">
                        {[
                            { key: 'Document name', val: result.name },
                            { key: 'File type', val: result.mime_type },
                            { key: 'File size', val: `${(result.size_bytes / 1024).toFixed(1)} KB` },
                            { key: 'Scan duration', val: scanDuration ? `${scanDuration}s` : '—' },
                        ].map(({ key, val }) => (
                            <div key={key} className="px-4 py-3">
                                <p className="text-xs text-text-muted-3 uppercase tracking-wide mb-1">{key}</p>
                                <p className="text-sm font-bold text-text-primary truncate">{val}</p>
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-4 divide-x divide-border-lighter">
                        {[
                            { key: 'Scan type', val: scan?.scan_type ?? '—' },
                            { key: 'Uploaded at', val: new Date(result.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) },
                            { key: 'Scan status', val: scan?.status ?? '—' },
                            { key: 'Tamper score', val: scan ? scan.tamper_percent.toFixed(4) : '—' },
                        ].map(({ key, val }) => (
                            <div key={key} className="px-4 py-3">
                                <p className="text-xs text-text-muted-3 uppercase tracking-wide mb-1">{key}</p>
                                <p className="text-sm font-bold text-text-primary truncate">{val}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3">
                    <button
                        onClick={() => navigate('/history')}
                        className="px-6 py-2 text-sm font-bold border-2 border-border-strong bg-transparent text-text-primary cursor-pointer"
                    >
                        ← Back to History
                    </button>
                </div>
            </div>

            <StatusBar online={true} />
        </div>
    );
}