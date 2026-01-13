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

type GetAllCommunitiesRes struct {
	Communities *[]Community `json:"communities"`
}
