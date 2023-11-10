package routes

import (
	"Etch_A_Sketch/app/controller"

	"github.com/gofiber/fiber/v2"
)

// This function will create all the needed routes for our different pages
func SetupUserRoutes(app *fiber.App, userController *controller.UserController) {
	// Signup page for user
	app.Post("/signup", userController.Signup)

}
