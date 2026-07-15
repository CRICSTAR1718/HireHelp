export default function RegisterForm() {
    return (
        <form className="space-y-4">
            <input
                placeholder="Full Name"
                className="w-full rounded-md border p-3"
            />

            <input
                type="email"
                placeholder="Email"
                className="w-full rounded-md border p-3"
            />

            <input
                type="password"
                placeholder="Password"
                className="w-full rounded-md border p-3"
            />

            <button
                className="w-full rounded-md bg-green-600 py-3 text-white hover:bg-green-700"
            >
                Register
            </button>
        </form>
    );
}