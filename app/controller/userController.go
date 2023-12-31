package controller

import (
	"Etch_A_Sketch/app/middleware"
	"Etch_A_Sketch/app/models"
	"Etch_A_Sketch/app/repo"
	password "Etch_A_Sketch/app/utils"
	"fmt"
	"log"
	"time"

	"github.com/go-redis/redis"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// UserController handles all routes related to users
type UserController struct {
	db          *gorm.DB
	redisClient *redis.Client
}

const key = "sessionKey"

// NewUserController creates a new instance of UserController
func NewUserController(db *gorm.DB, rc *redis.Client) *UserController {
	return &UserController{
		db:          db,
		redisClient: rc,
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
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
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
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "Incorrect password or account does not exist. Please create an account to login.",
		})
	}
	// Check if password matches in database
	passMatch := repo.AuthenticateUser(credentials, controller.db)
	if passMatch {
		// To be able to identify this user on other pages, we need to create a cookie for their browser
		cookie := setCookie(c, key, uuid.NewString(), 24)
		redisVal := "name: " + credentials.Name + " id: " + fmt.Sprint(credentials.ID)
		// Set in Redis. Set time to 24 hours.
		middleware.SetInRedis(controller.redisClient, cookie.Value, redisVal, 24*time.Hour)
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

// Controller GetUser function. Checks if cookie is stored
// in browser and returns the condition to frontend
func (controller *UserController) GetUser(c *fiber.Ctx) error {
	cookie := c.Cookies(key)
	// If cookie is an empty string, means it doesn't exist
	if cookie == "" {
		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"success":  true,
			"loggedIn": false,
			"data":     nil,
		})
	} else {
		user, err := middleware.GetFromRedis(controller.redisClient, key)
		if err != nil {
			return c.Status(fiber.StatusOK).JSON(fiber.Map{
				"success":  true,
				"loggedIn": true,
				"data":     user,
			})
		} else {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"success":  false,
				"loggedIn": false,
				"data":     nil,
			})
		}
	}
}

// This function will take in parameters for the cookie and set them to the fiber context
func setCookie(c *fiber.Ctx, name string, value string, timeAmt time.Duration) *fiber.Cookie {
	cookie := new(fiber.Cookie)
	cookie.Name = name
	// We generate a random key to store in the cookie value. Also stored in redis cache
	cookie.Value = value
	cookie.Expires = time.Now().Add(timeAmt * time.Hour)
	c.Cookie(cookie)
	return cookie
}
