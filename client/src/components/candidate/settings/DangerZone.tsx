import Card from "../ui/Card";

export default function DangerZone() {
    return (
        <Card>

            <h2 className="text-xl font-semibold text-red-500">
                Danger Zone
            </h2>

            <p className="mt-3 text-slate-400">
                Permanently delete your HireHelp account.
            </p>

            <button className="mt-6 rounded-lg bg-red-600 px-5 py-2 text-white hover:bg-red-700">
                Delete Account
            </button>

        </Card>
    );
}