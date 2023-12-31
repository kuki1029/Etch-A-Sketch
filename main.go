package main

import (
	"log"
	"os"
	"os/signal"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/template/html/v2"

	"Etch_A_Sketch/app/controller"
	"Etch_A_Sketch/app/middleware"
	"Etch_A_Sketch/app/repo"
	"Etch_A_Sketch/routes"
)

// Stop the Fiber application
func exit(app *fiber.App) {
	_ = app.Shutdown()
}

func main() {

	// Create a new engine
	engine := html.New("./resources/views", ".html")

	// Pass the engine to the Views
	app := fiber.New(fiber.Config{
		Views: engine,
	})

	// This serves the files so it the HTML can render/load it
	app.Static("/JS", "./resources/JS")
	app.Static("/static", "./static")

	// Serves all the HTML filse
	app.Static("/", "./resources/views", fiber.Static{
		Index: "index.html",
	})

	// If user vists a page that doesn't exist
	// app.Use(func(c *fiber.Ctx) {
	// 	c.SendStatus(404)
	// })

	// Close any connections on interrupt signal
	c := make(chan os.Signal, 1)
	signal.Notify(c, os.Interrupt)
	go func() {
		<-c
		exit(app)
	}()

	// Setup database
	db := repo.ConnectToDB()

	// Setup redis cache
	redisClient := middleware.NewRedisClient()
	middleware.Ping(redisClient)

	// Setup controller
	userController := controller.NewUserController(db, redisClient)

	// Setup routes
	routes.SetupUserRoutes(app, userController)

	// Start listening on the specified address
	if err := app.Listen("0.0.0.0:3000"); err != nil {
		log.Panic(err)
	}
}
