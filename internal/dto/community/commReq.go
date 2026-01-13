package dto_community


type CreateCommunityReq struct {
	Name                      string  `json:"name"`
	Description               *string `json:"description"`
	Banner                    *string `json:"banner"`
	AllowPublicQuizSubmission bool    `json:"allow_public_quiz_submission"`
}
