interface QuizMetadataInputsProps {
    title: string;
    setTitle: (value: string) => void;
    description: string;
    setDescription: (value: string) => void;
    durationMinutes: number;
    setDurationMinutes: (value: number) => void;
}

const QuizMetadataInputs = ({
    title,
    setTitle,
    description,
    setDescription,
    durationMinutes,
    setDurationMinutes,
}: QuizMetadataInputsProps) => {
    return (
        <div className="space-y-6">
            {/* Quiz Title */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quiz Title
                </label>
                <input
                    type="text"
                    placeholder="e.g. Biology Chapter 2: Cell Structure"
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>

            {/* Description */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                </label>
                <textarea
                    placeholder="Describe what this quiz covers..."
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>

            {/* Duration */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (minutes)
                </label>
                <input
                    type="number"
                    min={1}
                    max={180}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(parseInt(e.target.value) || 15)}
                />
            </div>
        </div>
    );
};

export default QuizMetadataInputs;
