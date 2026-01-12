package dto_user

type UpdateUserRequest struct {
	Username string `json:"username"`
	Avatar   string `json:"avater"`
	Banner   string `json:"banner"`
}
