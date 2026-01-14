package models

import "time"

// quizzes (
//     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//     community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
//     creator_id UUID REFERENCES users(id) ON DELETE CASCADE,
//     title VARCHAR(200) NOT NULL,
//     description TEXT,
//     duration_minutes INTEGER,
//     likes_count INTEGER DEFAULT 0,
//     is_published BOOLEAN DEFAULT false,
//     created_at TIMESTAMP DEFAULT NOW(),
//     updated_at TIMESTAMP DEFAULT NOW()
// )

type Quiz struct {
	ID              string     `json:"id"`
	CommunityID     string     `json:"community_id"`
	CreatorID       string     `json:"creator_id"`
	Title           string     `json:"title"`
	Description     string     `json:"description"`
	DurationMinutes int        `json:"duration_minutes"`
	LikesCount      int        `json:"likes_count"`
	IsPublished     bool       `json:"is_published"`
	Quiestions      []Question `json:"questions,omitempty"`
	CreatedAt       time.Time  `json:"created_at"`
	UpdatedAt       time.Time  `json:"updated_at"`
}

//questions 
//     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//     quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
//     question_text TEXT NOT NULL,
//     explanation TEXT,
//     correct_answer TEXT NOT NULL,
//     order_index INT,
//     created_at TIMESTAMP DEFAULT NOW(),
//     updated_at TIMESTAMP DEFAULT NOW()
// 

type Question struct {
	ID            string    `json:"id"`
	QuizID        string    `json:"quiz_id"`
	QuestionText  string    `json:"question_text"`
	Explanation   string    `json:"explanation"`
	CorrectAnswer string    `json:"correct_answer"`
	OrderIndex    int       `json:"order_index"`
	Options       []Option  `json:"options,omitempty"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}
//options 
//   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//   question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
//   text TEXT NOT NULL,
//   is_correct BOOLEAN DEFAULT FALSE
// 
type Option struct {
	ID         string `json:"id"`
	QuestionID string `json:"question_id"`
	Text       string `json:"text"`
	IsCorrect  bool   `json:"is_correct"`
}