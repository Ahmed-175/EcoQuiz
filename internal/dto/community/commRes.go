package dto_community

type Community struct {
	ID                        string `json:"id"`
	Name                      string `json:"name"`
	Description               string `json:"description"`
	Banner                    string `json:"banner"`
	CreatorID                 string `json:"creator_id"`
	AllowPublicQuizSubmission bool   `json:"allow_public_quiz_submission"`
	CreatedAt                 string `json:"created_at"`
	UpdatedAt                 string `json:"updated_at"`
}

type Member struct {
	ID       string  `json:"id"`
	Username string  `json:"username"`
	Avatar   *string `json:"avatar"`
	Email    string  `json:"email"`
	Role     string  `json:"role"`
}

type Creator struct {
	ID       string  `json:"id"`
	Username string  `json:"username"`
	Avatar   *string `json:"avatar"`
	Email    string  `json:"email"`
	Role     string  `json:"role"`
}

type Quiz struct {
	ID                string  `json:"id"`
	Creator           Creator `json:"creator"`
	Title             string  `json:"title"`
	Description       string  `json:"description"`
	DurationMinutes   int     `json:"duration_minutes"`
	LikesCount        int     `json:"likes_count"`
	IsNew             bool    `json:"is_new"`
	NumberOfQuestions int     `json:"number_of_questions"`
	AverageScore      float64 `json:"average_score"`
	StudentsCount     int     `json:"students_count"`
	CreatedAt         string  `json:"created_at"`
}

type GetAllCommunitiesRes struct {
	Communities *[]Community `json:"communities"`
}

type GetCommunityByIDRes struct {
	Community Community `json:"community"`
	Members   []Member  `json:"members"`
	Quizzes   []Quiz    `json:"quizzes"`
}
