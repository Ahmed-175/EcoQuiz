interface ProgressIndicatorProps {
  currentIndex: number;
  totalQuestions: number;
  label?: string;
  showPercentage?: boolean;
}

export const ProgressIndicator = ({
  currentIndex,
  totalQuestions,
  label = "Question",
  showPercentage = true,
}: ProgressIndicatorProps) => {
  const percentage = ((currentIndex + 1) / totalQuestions) * 100;

  return (
    <div className="my-6 ">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">
          {label} {currentIndex + 1} of {totalQuestions}
        </span>
        {showPercentage && (
          <span className="text-sm font-medium text-gray-700">
            {Math.round(percentage)}% Complete
          </span>
        )}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className=" bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};
