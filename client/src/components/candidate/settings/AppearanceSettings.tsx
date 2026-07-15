import Card from "../ui/Card";

export default function AppearanceSettings() {
    return (
        <Card>

            <h2 className="mb-6 text-xl font-semibold text-white">
                Appearance
            </h2>

            <div className="flex items-center justify-between">

                <span className="text-slate-300">
                    Dark Theme
                </span>

                <input type="checkbox" defaultChecked />

            </div>

        </Card>
    );
}