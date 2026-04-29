import StatusBar from '../components/StatusBar';
import UploadZone from '../components/UploadZone';
import SubmitRow from '../components/SubmitRow';
import useUpload from '../hooks/UseUpload';
import { useState } from 'react';

export default function UploadPage() {
    const {
        file,
        isDragging,
        error,
        handleFileSelect,
        handleDragEnter,
        handleDragLeave,
        handleDragOver,
        handleDrop,
        handleSubmit,
    } = useUpload();

    const [docName, setDocName] = useState('');
    const hasFile = file !== null;
    const canSubmit = hasFile && docName.trim().length > 0;

    return (
        <div className="min-h-screen bg-page-bg"
            style={{
                backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 27px, #d4cfc4 28px),
                          repeating-linear-gradient(90deg, transparent, transparent 27px, #d4cfc4 28px)`,
                backgroundSize: '10px 10px',
            }}
        >
            <div className="max-w-5xl mx-auto bg-paper border-2 border-border-strong shadow-[6px_6px_0_#bbb,12px_12px_0_#ddd]">

                <main className="px-10 py-9">
                    <h1 className="text-2xl font-black text-text-primary border-b border-dashed border-border-lighter pb-2 mb-2">
                        Upload Document for Analysis
                    </h1>
                    <p className="text-base text-text-muted-3 mb-7">
                        Supports identity cards, certificates, and legal documents
                    </p>

                    <div className="flex flex-col gap-1.5 mb-6">
                        <label className="text-sm font-bold text-text-primary">Document Name</label>
                        <input
                            type="text"
                            value={docName}
                            onChange={(e) => setDocName(e.target.value)}
                            placeholder="e.g. John's Passport, Contract Draft 2"
                            className="px-4 py-2.5 border-2 border-border-mid bg-upload-bg text-text-primary text-base outline-none focus:border-border-strong"
                        />
                    </div>

                    <UploadZone
                        file={file}
                        isDragging={isDragging}
                        onFileSelect={handleFileSelect}
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                    />

                    {error && (
                        <p className="text-accent text-sm mb-4">{error}</p>
                    )}

                    <SubmitRow disabled={!canSubmit} onSubmit={() => handleSubmit(docName)} />
                </main>

                <StatusBar online={true} />
            </div>
        </div>
    );
}