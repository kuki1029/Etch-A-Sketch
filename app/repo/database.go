package repo

import (
	"Etch_A_Sketch/app/models"
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// This function will setup the database connection
func ConnectToDB() *gorm.DB {
	// Load config
	err := godotenv.Load(".env")
	if err != nil {
		// We log fatal as the env file is crucial to this function
		log.Fatal("Error loading environment variables \n", err)
	}
	// Create the string so we can login and open the PostgreSQL DB
	loginDB := fmt.Sprintf("host=postgres user=%s password=%s dbname=%s port=%s",
		os.Getenv("DB_USER"), os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"), os.Getenv("DB_PORT"))
	// Set logger to silent to keep the terminal clean of junk and queries
	db, err := gorm.Open(postgres.Open(loginDB), &gorm.Config{})
	// Now we check for errors to be sure everything is okay
	if err != nil {
		log.Fatal("Failed to connect to database. \n", err)
	} else {
		db.AutoMigrate(models.User{})
	}
	return db
}
