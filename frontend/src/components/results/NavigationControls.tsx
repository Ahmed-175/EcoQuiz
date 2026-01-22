import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface NavigationControlsProps {
  currentIndex: number;
  totalQuestions: number;
  onPrevious: () => void;
  onNext: () => void;
  onQuestionClick: (index: number) => void;
  className?: string;
  showDots?: boolean;
}

export const NavigationControls = ({
  currentIndex,
  totalQuestions,
  onPrevious,
  onNext,
  onQuestionClick,
  className = "",
  showDots = true,
}: NavigationControlsProps) => {
  const isFirstQuestion = currentIndex === 0;
  const isLastQuestion = currentIndex === totalQuestions - 1;

  return (
    <div className={`flex justify-between items-center ${className}`}>
      <NavigationButton
        direction="previous"
        onClick={onPrevious}
        disabled={isFirstQuestion}
        label="Previous"
      />

      {showDots && (
        <div className="flex gap-2">
          {Array.from({ length: totalQuestions }).map((_, index) => (
            <button
              key={index}
              onClick={() => onQuestionClick(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentIndex
                  ? "bg-blue-600 scale-125"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to question ${index + 1}`}
            />
          ))}
        </div>
      )}

      <NavigationButton
        direction="next"
        onClick={onNext}
        disabled={isLastQuestion}
        label="Next"
      />
    </div>
  );
};

interface NavigationButtonProps {
  direction: "previous" | "next";
  onClick: () => void;
  disabled: boolean;
  label: string;
}

const NavigationButton = ({
  direction,
  onClick,
  disabled,
  label,
}: NavigationButtonProps) => {
  const isPrevious = direction === "previous";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
        disabled
          ? "text-gray-400 bg-gray-100 cursor-not-allowed"
          : "text-blue-600 bg-white hover:bg-blue-50 shadow-sm border border-gray-200 hover:border-blue-300"
      }`}
    >
      {isPrevious && <FaChevronLeft />}
      <span>{label}</span>
      {!isPrevious && <FaChevronRight />}
    </button>
  );
};