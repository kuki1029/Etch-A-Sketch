package controller

import (
	"Etch_A_Sketch/app/models"
	"Etch_A_Sketch/app/repo"
	password "Etch_A_Sketch/app/utils"
	"log"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
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

	err = repo.CheckUserExists(credentials, controller.db)
	if err == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"success": false,
			"message": "User already exists. Please login or try again.",
		})
	}
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

// Controller Login function. Takes in user details
// and calls appropriate repo functions to Login user
func (controller *UserController) Login(c *fiber.Ctx) error {
	var credentials models.User
	// Parse data from frontend
	err := c.BodyParser(&credentials)
	if err != nil {
		log.Printf("Error parsing credentials")
	}
	// See if the email even exists in our DB
	err = repo.CheckUserExists(credentials, controller.db)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"success": false,
			"message": "Incorrect password or account does not exist. Please create an account to login.",
		})
	}
	// Check if password matches in database
	passMatch := repo.AuthenticateUser(credentials, controller.db)
	if passMatch {
		// TODO: Add cookies and caching
		// To be able to identify this user on other pages, we need to create a cookie for their browser
		_ = setCookie(c, "sessionKey", uuid.NewString(), 24)
		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"success": true,
			"message": "Successfully logged in.",
		})
	} else {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"success": false,
			"message": "Incorrect password or account does not exist. Please try again.",
		})
	}
}

// This function will take in parameters for the cookie and set them to the fiber context
func setCookie(ctx *fiber.Ctx, name string, value string, timeAmt time.Duration) *fiber.Cookie {
	cookie := new(fiber.Cookie)
	cookie.Name = name
	// We generate a random key to store in the cookie value. Also stored in redis cache
	cookie.Value = value
	cookie.Expires = time.Now().Add(timeAmt * time.Hour)
	ctx.Cookie(cookie)
	return cookie
}
