package middleware

import (
	"fmt"
	"log"
	"os"
	"time"

	"github.com/go-redis/redis"
	"github.com/joho/godotenv"
)

// NewRedisClient creates a new instance of the Redis Client
func NewRedisClient() *redis.Client {
	// Load config
	err := godotenv.Load(".env")
	if err != nil {
		// We log fatal as the env file is crucial to this function
		log.Fatal("Error loading environment variables \n", err)
	}
	// We use 'redis' as the host here bcoz inside the docker container, localhost
	// becomes the hostname of the container
	client := redis.NewClient(&redis.Options{
		Addr: "redis:" + os.Getenv("REDIS_PORT"),
	})
	return client
}

// Sets the value in the Redis client
func SetInRedis(rc *redis.Client, key string, redisVal string, timeAmt time.Duration) {
	rc.Set(key, redisVal, timeAmt)
}

// Gets the value from the redis client
func GetFromRedis(rc *redis.Client, key string) (string, error) {
	value := rc.Get(key)
	if value.Err() == nil {
		fmt.Println(value)
		return value.String(), nil
	} else {
		// Return blank string and the error if we cannot find the key in cache
		return "", value.Err()
	}
}

// Checks if the server is online for redis
func Ping(rc *redis.Client) error {
	pong, err := rc.Ping().Result()
	if err != nil {
		log.Panic(err.Error())
	}
	fmt.Println(pong, err)
	// Output: PONG <nil>
	return nil
}
