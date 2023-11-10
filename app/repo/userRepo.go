package repo

import (
	"Etch_A_Sketch/app/models"

	"gorm.io/gorm"
)

// This function will simply add given credentials to the database.
// Does not check for duplicates or anything else.
func AddUser(userInfo models.User, db *gorm.DB) error {
	// Add task to database by making a model of user type
	userCreate := models.User{
		Name:     userInfo.Name,
		Email:    userInfo.Email,
		Password: userInfo.Password,
	}
	err := db.Create(&userCreate)
	return err.Error
}
