import { useEffect } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";

interface ToastProps {
    message: string;
    onClose: () => void;
    duration?: number;
}

const Toast = ({ message, onClose, duration = 3000 }: ToastProps) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [onClose, duration]);

    return (
        <div className="fixed top-5 right-5 z-[9999] animate-in slide-in-from-right fade-in">
            <div className="bg-red-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 border border-red-400/20 backdrop-blur-md">
                <AiOutlineCloseCircle className="text-2xl" />
                <span className="font-medium">{message}</span>
                <button
                    onClick={onClose}
                    className="ml-4 hover:scale-110 transition-transform cursor-pointer"
                >
                    <AiOutlineCloseCircle className="text-lg opacity-80" />
                </button>
            </div>
        </div>
    );
};

export default Toast;
