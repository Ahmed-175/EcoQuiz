package dto_community

import (
	"database/sql"
	"ecoquiz/internal/models"
)


func MapperCreateCommunityReq(req *CreateCommunityReq) *models.Community {
	var description sql.NullString
	if req.Description != nil {
		description = sql.NullString{
			String: *req.Description,
			Valid:  true,
		}
	} else {
		description = sql.NullString{
			Valid: false,
		}
	}

	var banner sql.NullString
	if req.Banner != nil {
		banner = sql.NullString{
			String: *req.Banner,
			Valid:  true,
		}
	} else {
		banner = sql.NullString{
			Valid: false,
		}
	}

	return &models.Community{
		Name:                      req.Name,
		Description:               description,
		Banner:                    banner,
		AllowPublicQuizSubmission: req.AllowPublicQuizSubmission,
	}
}
