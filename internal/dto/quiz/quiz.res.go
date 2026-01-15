package dto_quiz

type QuizResponse struct {
	ID                string    `json:"id"`
	Community         Community `json:"community_id"`
	Creator           Creator   `json:"creator"`
	Title             string    `json:"title"`
	Description       string    `json:"description"`
	DurationMinutes   int       `json:"duration_minutes"`
	LikesCount        int       `json:"likes_count"`
	IsNew             bool      `json:"is_new"`
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
	Community         CommunityDetail    `json:"community_id"`
	Creator           Creator            `json:"creator"`
	Title             string             `json:"title"`
	Description       string             `json:"description"`
	DurationMinutes   int                `json:"duration_minutes"`
	LikesCount        int                `json:"likes_count"`
	IsNew             bool               `json:"is_new"`
	NumberOfQuestions int                `json:"number_of_questions"`
	AverageScore      float64            `json:"average_score"`
	StudentsCount     int                `json:"students_count"`
	Leaderboard       []LeaderboardEntry `json:"leaderboard"`
	CreatedAt         string             `json:"created_at"`
}

type CommunityDetail struct {
	ID        string  `json:"id"`
	Name      string  `json:"name"`
	Banner    *string `json:"banner"`
	IsJoined  string  `json:"is_joined"` //  CREATOR - JOINED - NOT_JOINED
	CreatedAt string  `json:"created_at"`
}

type LeaderboardEntry struct {
	AttemptID   string  `json:"attempt_id"`
	Score       float64 `json:"score"`
	SubmittedAt string  `json:"submitted_at"`
	User        User    `json:"user"`
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
