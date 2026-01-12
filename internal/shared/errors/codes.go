package sharedErrors

// Auth errors
const (
	ErrInvalidBody   = "INVALID_BODY"
	ErrEmailRequired = "EMAIL_REQUIRED"
	ErrWeakPassword  = "WEAK_PASSWORD"
	ErrEmailExists   = "EMAIL_ALREADY_EXISTS"
	ErrUnauthorized  = "UNAUTHORIZED"
)

// User errors
const (
	ErrUserNotFound = "USER_NOT_FOUND"
	ErrForbidden    = "FORBIDDEN"
)

// System errors
const (
	ErrInternal = "INTERNAL_ERROR"
)
