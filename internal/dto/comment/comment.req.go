package dto_comment

type CreateCommentReq struct {
	Text string `json:"text" binding:"required"`
}
