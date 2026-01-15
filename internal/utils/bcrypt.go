package utils

import (
	"fmt"

	"golang.org/x/crypto/bcrypt"
)

func HashPassword(password string) (string, error) {
	hashed, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	hashedStr := string(hashed)
	return hashedStr, nil
}



func CheckPasswordHash(password string, hash *string) bool {
	if hash == nil {
		return false
	}
	err := bcrypt.CompareHashAndPassword([]byte(*hash), []byte(password))

	fmt.Println(err.Error())
	return err == nil
}
