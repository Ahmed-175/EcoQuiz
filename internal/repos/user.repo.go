package repos

import (
	"context"
	"ecoquiz/internal/models"

	"github.com/jackc/pgx/v5/pgxpool"
)

type UserRepo interface {
	Create(ctx context.Context, user *models.User) error
	FindByID(ctx context.Context, userID string) (*models.User, error)
	FindByEmail(ctx context.Context, email string) (*models.User, error)
	Update(ctx context.Context, avater string, banner string, username string, userID string) error
}

type userRepo struct {
	db *pgxpool.Pool
}

func NewUserRepo(db *pgxpool.Pool) UserRepo {
	return &userRepo{
		db: db,
	}
}

func (r *userRepo) Create(ctx context.Context, user *models.User) error {
	query := `INSERT INTO users(username , email , avatar , google_id)
	 VALUES ($1 , $2 , $3 , $4) 
	 RETURNING id , created_at , updated_at 
	 `
	return r.db.QueryRow(ctx, query, user.Username, user.Email, user.Avatar, user.GoogleID).Scan(
		&user.ID,
		&user.CreatedAt,
		&user.Updated_at,
	)
}

func (r *userRepo) FindByID(ctx context.Context, userID string) (*models.User, error) {
	query := `SELECT 
	id ,
    username ,
    avatar ,
	email ,
	google_id ,
	banner ,
	created_at , 
	updated_at FROM users WHERE id = $1`
	user := models.User{}

	err := r.db.QueryRow(ctx, query, userID).Scan(
		&user.ID,
		&user.Username,
		&user.Avatar,
		&user.Email,
		&user.GoogleID,
		&user.Banner,
		&user.CreatedAt,
		&user.Updated_at)

	if err != nil {
		return nil, err
	}

	return &user, nil

}

func (r *userRepo) FindByEmail(ctx context.Context, email string) (*models.User, error) {
	query := `SELECT 
	id ,
    username ,
    avatar ,
	email ,
	google_id ,
	banner ,
	created_at , 
	updated_at FROM users WHERE email = $1`
	user := models.User{}

	err := r.db.QueryRow(ctx, query, email).Scan(
		&user.ID,
		&user.Username,
		&user.Avatar,
		&user.Email,
		&user.GoogleID,
		&user.Banner,
		&user.CreatedAt,
		&user.Updated_at)

	if err != nil {
		return nil, err
	}
	return &user, nil

}

func (r *userRepo) Update(ctx context.Context, avater string, banner string, username string, userID string) error {
	query := `
	UPDATE users 
	SET avatar = $1,
	    banner = $2,
	    username = $3,
	    updated_at = NOW()
	WHERE id = $4
	`
	_, err := r.db.Exec(ctx, query, avater, banner, username, userID)
	return err
}
