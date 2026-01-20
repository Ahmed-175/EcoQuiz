package dto_community

type CommunityDetailRes struct {
	ID                        string   `json:"id"`
	Name                      string   `json:"name"`
	Description               string   `json:"description"`
	Banner                    string   `json:"banner"`
	Creator                   Creator  `json:"creator"`
	AllowPublicQuizSubmission bool     `json:"allow_public_quiz_submission"`
	NumberOfQuizzes           int      `json:"number_of_quizzes"`
	CreatedAt                 string   `json:"created_at"`
	MemberRole                string   `json:"member_role"` // "CREATOR", "ADMIN", "MEMBER", "NON_MEMBER"
	Members                   []Member `json:"members"`
	NumberOfMembers           int      `json:"number_of_members"`
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
	IsLike            bool    `json:"is_like"`
	NumberOfQuestions int     `json:"number_of_questions"`
	AverageScore      float64 `json:"average_score"`
	StudentsCount     int     `json:"students_count"`
	CreatedAt         string  `json:"created_at"`
}

type GetAllCommunitiesRes struct {
	Communities *[]CommunityDetailRes `json:"communities"`
}

type GetCommunityByIDRes struct {
	Community CommunityDetailRes `json:"community"`
	Quizzes   []Quiz             `json:"quizzes"`
}

// UserCommunityDetail represents a community in the user profile
type UserCommunityDetail struct {
	ID              string `json:"id"`
	Name            string `json:"name"`
	JoinedAt        string `json:"joinedAt"`
	NumberOfQuizzes int    `json:"numberOfQuizzes"`
	Role            string `json:"role"`       // CREATOR - MEMBER - NON_MEMBER
	MemberRole      string `json:"memberRole"` // Role assigned to member
	MemberCount     int    `json:"memberCount"`
}
