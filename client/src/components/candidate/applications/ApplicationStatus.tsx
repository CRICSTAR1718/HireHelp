interface Props {
    status: "Applied" | "Interview" | "Rejected" | "Offer";
}

export default function ApplicationStatus({ status }: Props) {
    const colors = {
        Applied: "bg-blue-600",
        Interview: "bg-yellow-500",
        Rejected: "bg-red-600",
        Offer: "bg-green-600",
    };

    return (
        <span
            className={`rounded-full px-3 py-1 text-xs font-semibold text-white ${colors[status]}`}
        >
            {status}
        </span>
    );
}