package controller

import (
	"Etch_A_Sketch/app/models"
	"Etch_A_Sketch/app/repo"
	password "Etch_A_Sketch/app/utils"
	"log"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

// UserController handles all routes related to users
type UserController struct {
	db *gorm.DB
}

// NewUserController creates a new instance of UserController
func NewUserController(db *gorm.DB) *UserController {
	return &UserController{
		db: db,
	}
}

// Controller signup function. Takes in user details
// and calls appropriate repo functions to signup user
// This will check for duplicates
func (controller *UserController) Signup(c *fiber.Ctx) error {
	var credentials models.User
	// Parse data from frontend
	err := c.BodyParser(&credentials)
	if err != nil {
		log.Printf("Error parsing credentials")
	}

	// TODO: Check if user already exists
	// Now we hash the password
	credentials.Password = password.Generate(credentials.Password)
	// Now we add to the database
	err = repo.AddUser(credentials, controller.db)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"success": false,
			"message": err.Error(),
		})
	} else {
		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"success": true,
			"message": "Account succesfully created.",
		})
	}
}
