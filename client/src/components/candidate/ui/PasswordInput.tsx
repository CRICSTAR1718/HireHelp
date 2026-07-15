import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import Input from "./Input";

interface Props {
    placeholder?: string;
}

export default function PasswordInput(props: Props) {
    const [show, setShow] = useState(false);

    return (
        <div className="relative">
            <Input
                type={show ? "text" : "password"}
                {...props}
            />

            <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-4 top-3"
            >
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
        </div>
    );
}