interface StatusBarProps {
    online?: boolean;
}

export default function StatusBar({ online = true }: StatusBarProps) {
    return (
        <div className="flex items-center gap-2 px-7 py-2 bg-navbar-bg border-t-2 border-border-strong">
            <span className={`w-2.5 h-2.5 rounded-full border-2 inline-block
        ${online ? 'bg-status-online border-status-online-border' : 'bg-red-500 border-red-700'}`}
            />
            <span className="text-sm text-text-muted-2">
                ML Backend: {online ? 'Online' : 'Offline'}&nbsp;|&nbsp;
                Models loaded: Tampering (CASIA v2.0 / DocTamper)
            </span>
        </div>
    );
}
