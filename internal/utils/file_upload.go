// utils/file_upload.go
package utils

import (
	"fmt"
	"io"
	"mime/multipart"
	"os"
	"path/filepath"
	"time"
)

func SaveImage(file *multipart.FileHeader, folder string) (string, error) {
	if err := os.MkdirAll("uploads/"+folder, 0755); err != nil {
		return "", err
	}

	ext := filepath.Ext(file.Filename)
	filename := fmt.Sprintf("%d%s", time.Now().UnixNano(), ext)

	path := filepath.Join("uploads", folder, filename)

	if err := saveMultipartFile(file, path); err != nil {
		return "", err
	}

	return "/uploads/" + folder + "/" + filename, nil
}

func saveMultipartFile(file *multipart.FileHeader, path string) error {
	src, err := file.Open()
	if err != nil {
		return err
	}
	defer src.Close()

	dst, err := os.Create(path)
	if err != nil {
		return err
	}
	defer dst.Close()

	_, err = io.Copy(dst, src)
	return err
}
