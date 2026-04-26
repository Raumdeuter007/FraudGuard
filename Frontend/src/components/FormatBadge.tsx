interface FormatBadgeProps {
    label: string;
    icon: string;
}

export default function FormatBadge({ label, icon }: FormatBadgeProps) {
    return (
        <span className="text-sm px-3 py-0.5 border border-badge-border text-text-muted-2 bg-paper">
            {icon} {label}
        </span>
    );
}