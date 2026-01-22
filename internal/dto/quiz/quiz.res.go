package dto_quiz

type QuizResponse struct {
	ID                string    `json:"id"`
	Community         Community `json:"community"`
	Creator           Creator   `json:"creator"`
	Title             string    `json:"title"`
	Description       string    `json:"description"`
	DurationMinutes   int       `json:"duration_minutes"`
	LikesCount        int       `json:"likes_count"`
	IsNew             bool      `json:"is_new"`
	IsLiked           bool      `json:"is_liked"`
	NumberOfQuestions int       `json:"number_of_questions"`
	AverageScore      float64   `json:"average_score"`
	StudentsCount     int       `json:"students_count"`
	CreatedAt         string    `json:"created_at"`
}

type Community struct {
	ID       string  `json:"id"`
	Name     string  `json:"name"`
	Banner   *string `json:"banner"`
	IsJoined string  `json:"is_joined"` //  CREATOR - JOINED - NOT_JOINED
}

type Creator struct {
	ID       string  `json:"id"`
	Username string  `json:"username"`
	Email    string  `json:"email"`
	Avatar   *string `json:"avatar"`
	Role     string  `json:"role"` // creator - admin - member
}

type QuizDetailResponse struct {
	ID                string             `json:"id"`
	Community         CommunityDetail    `json:"community"`
	Creator           Creator            `json:"creator"`
	Title             string             `json:"title"`
	Description       string             `json:"description"`
	DurationMinutes   int                `json:"duration_minutes"`
	LikesCount        int                `json:"likes_count"`
	IsNew             bool               `json:"is_new"`
	IsLike            bool               `json:"is_like"`
	NumberOfQuestions int                `json:"number_of_questions"`
	AverageScore      float64            `json:"average_score"`
	StudentsCount     int                `json:"students_count"`
	Leaderboard       []LeaderboardEntry `json:"leaderboard"`
	CreatedAt         string             `json:"created_at"`
	CurrentAttemptID  *string            `json:"current_attempt_id,omitempty"`
}

type CommunityDetail struct {
	ID        string  `json:"id"`
	Name      string  `json:"name"`
	Banner    *string `json:"banner"`
	IsJoined  string  `json:"is_joined"` //  CREATOR - JOINED - NOT_JOINED
	CreatedAt string  `json:"created_at"`
}

type LeaderboardEntry struct {
	AttemptID        string  `json:"attempt_id"`
	TimeTakenMinutes int     `json:"time_taken_minutes"`
	Score            float64 `json:"score"`
	SubmittedAt      string  `json:"submitted_at"`
	User             User    `json:"user"`
}

type User struct {
	ID       string  `json:"id"`
	Username string  `json:"username"`
	Email    string  `json:"email"`
	Avatar   *string `json:"avatar"`
}

type TakeQuizResponse struct {
	QuizID    string         `json:"quiz_id"`
	Title     string         `json:"title"`
	Duration  int            `json:"duration"`
	Questions []QuestionTake `json:"questions"`
}

type QuestionTake struct {
	QuestionID   string       `json:"question_id"`
	QuestionText string       `json:"question_text"`
	Options      []OptionTake `json:"options"`
}

type OptionTake struct {
	OptionID string `json:"option_id"`
	Text     string `json:"text"`
}

// UserAttemptWithQuiz represents a quiz attempt with quiz details for profile
type UserAttemptWithQuiz struct {
	Quiz             QuizInfo `json:"quiz"`
	Score            int      `json:"score"`
	TimeTakenMinutes int      `json:"timeTakenMinutes"`
	AttemptNumber    int      `json:"attemptNumber"`
	Percentage       float64  `json:"percentage"`
	CompletedAt      string   `json:"completedAt"`
}

// QuizInfo represents minimal quiz info for profile attempts
type QuizInfo struct {
	ID             string `json:"id"`
	Title          string `json:"title"`
	QuestionsCount int    `json:"questionsCount"`
}

// QuizResultResponse represents the full breakdown of a quiz attempt
type QuizResultResponse struct {
	AttemptID        string           `json:"attempt_id"`
	QuizID           string           `json:"quiz_id"`
	QuizTitle        string           `json:"quiz_title"`
	Score            int              `json:"score"`
	TotalQuestions   int              `json:"total_questions"`
	Percentage       float64          `json:"percentage"`
	TimeTakenMinutes int              `json:"time_taken_minutes"`
	CompletedAt      string           `json:"completed_at"`
	Questions        []QuestionResult `json:"questions"`
}

type QuestionResult struct {
	QuestionID    string            `json:"question_id"`
	QuestionText  string            `json:"question_text"`
	Explanation   string            `json:"explanation"`
	CorrectAnswer string            `json:"correct_answer"`
	UserAnswer    *string           `json:"user_answer"` // Option ID picked by user
	IsCorrect     bool              `json:"is_correct"`
	Options       []OptionWithStats `json:"options"`
	Comments      []CommentRes      `json:"comments"`
}

type OptionWithStats struct {
	OptionID       string  `json:"option_id"`
	Text           string  `json:"text"`
	IsCorrect      bool    `json:"is_correct"`
	SelectionCount int     `json:"selection_count"`
	Percentage     float64 `json:"percentage"`
}

type CommentRes struct {
	ID          string  `json:"id"`
	UserID      string  `json:"user_id"`
	Username    string  `json:"username"`
	Avatar      *string `json:"avatar"`
	CommentText string  `json:"comment_text"`
	CreatedAt   string  `json:"created_at"`
}
