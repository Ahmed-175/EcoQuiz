package dto_user

import "time"

type Profile struct {
	ID          string      `json:"id"`
	Email       string      `json:"email"`
	Username    string      `json:"username"`
	Avatar      *string     `json:"avatar"`
	Banner      *string     `json:"banner"`
	Communities []Community `json:"communities"`
	Attempts    []Attempt   `json:"attempts"`
	CreatedAt   time.Time   `json:"createdAt"`
}

type Attempt struct {
	Quiz             Quiz   `json:"quiz"`
	Score            int    `json:"score"`
	TimeTakenMinutes int    `json:"timeTakenMinutes"`
	AttemptNumber    int    `json:"attemptNumber"`
	Percentage       int    `json:"percentage"`
	CompletedAt      string `json:"completedAt"`
}

type Community struct {
	ID              string `json:"id"`
	Name            string `json:"name"`
	JoinIn       string `json:"joinI"`
	NumberOfQuizzes int    `json:"numberOfQuizzes"`
	Role            string `json:"role"` // CREATOR - MEMBER - NON_MEMBER
	MemberRole      string `json:"memberRole"`
	MemberCount     int    `json:"memberCount"`
}

type Quiz struct {
	ID             string `json:"id"`
	Title          string `json:"title"`
	QuestionsCount int    `json:"questionsCount"`
}
