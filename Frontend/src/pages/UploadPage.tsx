import Navbar from '../components/ui/Navbar';
import StatusBar from '../components/ui/StatusBar';
import UploadZone from '../features/upload/components/UploadZone';
import SubmitRow from '../features/upload/components/SubmitRow';
import { useUpload } from '../features/upload';

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

    const hasFile = file !== null;

    return (
        <div className="min-h-screen bg-page-bg"
            style={{
                backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 27px, #d4cfc4 28px),
                          repeating-linear-gradient(90deg, transparent, transparent 27px, #d4cfc4 28px)`,
                backgroundSize: '10px 10px',
            }}
        >
            <div className="max-w-5xl mx-auto bg-paper border-2 border-border-strong shadow-[6px_6px_0_#bbb,12px_12px_0_#ddd]">
                <Navbar />

                <main className="px-10 py-9">
                    <h1 className="text-2xl font-black text-text-primary border-b border-dashed border-border-lighter pb-2 mb-2">
                        Upload Document for Analysis
                    </h1>
                    <p className="text-base text-text-muted-3 mb-7">
                        Supports identity cards, certificates, and legal documents
                    </p>

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

                    <SubmitRow disabled={!hasFile} onSubmit={handleSubmit} />
                </main>

                <StatusBar online={true} />
            </div>
        </div>
    );
}