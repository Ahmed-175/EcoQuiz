package sharedErrors

import "net/http"

type AppError struct {
	Code       string
	Message    string
	StatusCode int
}

func (e *AppError) Error() string {
	return e.Message
}

func BadRequest(code, msg string) *AppError {
	return &AppError{code, msg, http.StatusBadRequest}
}

func Unauthorized(code, msg string) *AppError {
	return &AppError{code, msg, http.StatusUnauthorized}
}

func Forbidden(code, msg string) *AppError {
	return &AppError{code, msg, http.StatusForbidden}
}

func NotFound(code, msg string) *AppError {
	return &AppError{code, msg, http.StatusNotFound}
}

func Conflict(code, msg string) *AppError {
	return &AppError{code, msg, http.StatusConflict}
}

func Internal() *AppError {
	return &AppError{
		Code:       "INTERNAL_ERROR",
		Message:    "Something went wrong",
		StatusCode: http.StatusInternalServerError,
	}
}
