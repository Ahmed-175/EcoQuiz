import { HiOutlineClipboardDocumentList } from "react-icons/hi2";

interface QuizActionsProps {
    isPublished: boolean;
    setIsPublished: (value: boolean) => void;
    handleCreateQuiz: () => void;
    isLoading: boolean;
}

const CreateQuizActions = ({
    isPublished,
    setIsPublished,
    handleCreateQuiz,
    isLoading,
}: QuizActionsProps) => {
    return (
        <div className="space-y-6">
            {/* Publish Toggle */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center gap-3">
                    <HiOutlineClipboardDocumentList className="text-indigo-600" />
                    <div>
                        <h3 className="font-medium">Publish Quiz</h3>
                        <p className="text-sm text-gray-600">
                            Make this quiz available to community members
                        </p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={() => setIsPublished(!isPublished)}
                    className={`w-11 h-6 rounded-full transition ${isPublished ? "bg-blue-600" : "bg-gray-300"
                        }`}
                >
                    <span
                        className={`block w-4 h-4 bg-white rounded-full transform transition ${isPublished ? "translate-x-6" : "translate-x-1"
                            }`}
                    />
                </button>
            </div>

            {/* Submit Button */}
            <button
                onClick={handleCreateQuiz}
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? "Creating Quiz..." : "Create Quiz"}
            </button>
        </div>
    );
};

export default CreateQuizActions;
