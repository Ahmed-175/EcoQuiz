import { HiOutlineClipboardDocumentList } from "react-icons/hi2";

const QuizHeaderCreation = () => {
    return (
        <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-blue-100 to-indigo-100 rounded-full mb-4">
                <HiOutlineClipboardDocumentList className="text-2xl text-blue-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                Create Quiz
            </h1>
            <p className="text-gray-600">
                Build an engaging quiz for your community
            </p>
        </div>
    );
};

export default QuizHeaderCreation;
