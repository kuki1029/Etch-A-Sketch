package models

import (
	"gorm.io/gorm"
)

// The email is already validated through HTML
type User struct {
	gorm.Model
	Name     string `json:"name"`
	Password string `json:"password" gorm:"Index;not null"`
}
