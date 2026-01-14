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
}
