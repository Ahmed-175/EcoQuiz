package utils

import (
	"fmt"
	"time"

	"database/sql"
	dto_community "ecoquiz/internal/dto/community"
	"ecoquiz/internal/models"
)

func nullStringToPtr(ns sql.NullString) *string {
	if ns.Valid {
		return &ns.String
	}
	return nil
}

func formatTime(t time.Time) string {
	now := time.Now()
	duration := now.Sub(t)
	var age string

	if duration.Hours() < 1 { 
		minutes := int(duration.Minutes())
		if minutes <= 1 {
			age = "less than a minute ago"
		} else {
			age = fmt.Sprintf("%d minutes ago", minutes)
		}
	} else if duration.Hours() < 24 { 
		hours := int(duration.Hours())
		if hours == 1 {
			age = "1 hour ago"
		} else {
			age = fmt.Sprintf("%d hours ago", hours)
		}
	} else if duration.Hours() < 24*30 {
		days := int(duration.Hours() / 24)
		if days == 1 {

			age = "1 day ago"
		} else {
			age = fmt.Sprintf("%d days ago", days)
		}
	} else if duration.Hours() < 24*365 { 
		months := int(duration.Hours() / 24 / 30)
		if months == 1 {
			age = "1 month ago"
		} else {
			age = fmt.Sprintf("%d months ago", months)
		}
	} else { 
		years := int(duration.Hours() / 24 / 365)
		if years == 1 {
			age = "1 year ago"
		} else {
			age = fmt.Sprintf("%d years ago", years)
		}
	}

	return fmt.Sprintf("%s - %d/%d/%d", age, t.Year(), t.Month(), t.Day())
}


func TransformTime(comms []*models.Community) *dto_community.GetAllCommunitiesRes {
	var commsList []dto_community.Community

	for _, comm := range comms {
		c := dto_community.Community{
			ID:                        comm.ID,
			Name:                      comm.Name,
			Description:               *nullStringToPtr(comm.Description),
			Banner:                    *nullStringToPtr(comm.Banner),
			CreatorID:                 comm.CreatorID,
			AllowPublicQuizSubmission: comm.AllowPublicQuizSubmission,
			CreatedAt:                 formatTime(comm.CreatedAt),
			UpdatedAt:                  formatTime(comm.UpdatedAt),
		}
		commsList = append(commsList, c)
	}

	return &dto_community.GetAllCommunitiesRes{
		Communities: &commsList,
	}
}

func TransformSingleCommunity(comm *models.Community) *dto_community.Community {
	return &dto_community.Community{
		ID:                        comm.ID,
		Name:                      comm.Name,
		Description:               *nullStringToPtr(comm.Description),
		Banner:                    *nullStringToPtr(comm.Banner),
		CreatorID:                 comm.CreatorID,
		AllowPublicQuizSubmission: comm.AllowPublicQuizSubmission,
		CreatedAt:                 formatTime(comm.CreatedAt),
		UpdatedAt:                 formatTime(comm.UpdatedAt),
	}
}
