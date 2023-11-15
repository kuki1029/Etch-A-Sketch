package repo

import (
	"Etch_A_Sketch/app/models"
	password "Etch_A_Sketch/app/utils"

	"gorm.io/gorm"
)

// This function will simply add given credentials to the database.
// Does not check for duplicates or anything else.
func AddUser(userInfo models.User, db *gorm.DB) error {
	// Add task to database by making a model of user type
	userCreate := models.User{
		Name:     userInfo.Name,
		Password: userInfo.Password,
	}
	err := db.Create(&userCreate)
	return err.Error
}

// Function will check if the given user exists in database or not
// Does not do any hashing. Returns true if user exists.
func CheckUserExists(userInfo models.User, db *gorm.DB) error {
	var userCreate models.User
	err := db.Where("name = ?", userInfo.Name).First(&userCreate).Error
	return err
}

// Will verify if the users password is correct by checking the hash
// in the database and verifying it.
func AuthenticateUser(userInfo models.User, db *gorm.DB) bool {
	var userPass models.User
	// Find the users original password
	err := db.Where("name = ?", userInfo.Name).First(&userPass).Error
	if err != nil {
		return false
	}
	// Hash the plain text password
	hashedPass := password.Generate(userInfo.Password)
	passwordMatch := password.Verify(userPass.Password, hashedPass)
	return passwordMatch
}
