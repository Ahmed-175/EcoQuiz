package dto_quiz

type CreateQuizRequest struct {
	CommunityID     string     `json:"community_id" binding:"required,uuid"`
	Title           string     `json:"title" binding:"required,max=200"`
	Description     string     `json:"description" binding:"max=1000"`
	DurationMinutes int        `json:"duration_minutes" binding:"gte=0"`
	IsPublished     bool       `json:"is_published"`
	Questions       []Question `json:"questions,omitempty"`
}
type Question struct {
	QuestionText  string   `json:"question_text" binding:"required"`
	Explanation   string   `json:"explanation"`
	CorrectAnswer string   `json:"correct_answer"`
	OrderIndex    int      `json:"order_index"`
	Options       []Option `json:"options,omitempty"`
}

type Option struct {
	Text      string `json:"text" binding:"required"`
	IsCorrect bool   `json:"is_correct"`
}
