package main

import (
	"database/sql"
	"errors"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
)

type Series struct {
	ID             int    `json:"id" db:"id"`
	Title          string `json:"title" db:"title" binding:"required"`
	Description    string `json:"description" db:"description"`
	Status         string `json:"status" db:"status"` // pending, watching, completed
	CurrentEpisode int    `json:"current_episode" db:"current_episode"`
	TotalEpisodes  int    `json:"total_episodes" db:"total_episodes"`
	Score          int    `json:"score" db:"score"`
}

func main() {
	// Configuración de la base de datos
	db, err := sqlx.Connect("postgres", "user=user dbname=seriesdb password=password host=db sslmode=disable")
	if err != nil {
		log.Fatalf("Error connecting to database: %v", err)
	}
	defer db.Close()

	// Crear tablas si no existen
	if _, err := db.Exec(`
		CREATE TABLE IF NOT EXISTS series (
			id SERIAL PRIMARY KEY,
			title VARCHAR(255) NOT NULL,
			description TEXT,
			status VARCHAR(50) DEFAULT 'pending',
			current_episode INTEGER DEFAULT 0,
			total_episodes INTEGER,
			score INTEGER DEFAULT 0,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		);
	`); err != nil {
		log.Fatalf("Error creating tables: %v", err)
	}

	r := gin.Default()

	// Middleware para CORS
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}

		c.Next()
	})

	// Middleware para inyectar la conexión a la base de datos
	r.Use(func(c *gin.Context) {
		c.Set("db", db)
		c.Next()
	})

	// Endpoints
	r.GET("/api/series", getSeries)
	r.GET("/api/series/:id", getSeriesByID)
	r.POST("/api/series", createSeries)
	r.PUT("/api/series/:id", updateSeries)
	r.DELETE("/api/series/:id", deleteSeries)
	r.PATCH("/api/series/:id/status", updateStatus)
	r.PATCH("/api/series/:id/episode", incrementEpisode)
	r.PATCH("/api/series/:id/upvote", upvoteSeries)
	r.PATCH("/api/series/:id/downvote", downvoteSeries)

	// Iniciar el servidor
	if err := r.Run(":8080"); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

// Handler para obtener todas las series
func getSeries(c *gin.Context) {
	db := c.MustGet("db").(*sqlx.DB)

	var series []Series
	err := db.Select(&series, "SELECT * FROM series")

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, series)
}

// Handler para obtener una serie por ID
func getSeriesByID(c *gin.Context) {
	db := c.MustGet("db").(*sqlx.DB)
	id := c.Param("id")

	var series Series
	err := db.Get(&series, "SELECT * FROM series WHERE id = $1", id)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Series not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, series)
}

// Handler para crear una nueva serie
func createSeries(c *gin.Context) {
	db := c.MustGet("db").(*sqlx.DB)

	var newSeries Series
	if err := c.ShouldBindJSON(&newSeries); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Validaciones básicas
	if newSeries.Title == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Title is required"})
		return
	}

	// Valores por defecto
	if newSeries.Status == "" {
		newSeries.Status = "pending"
	}

	var id int
	err := db.QueryRow(`
		INSERT INTO series (title, description, status, current_episode, total_episodes, score)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING id
	`, newSeries.Title, newSeries.Description, newSeries.Status,
		newSeries.CurrentEpisode, newSeries.TotalEpisodes, newSeries.Score).Scan(&id)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	newSeries.ID = id
	c.JSON(http.StatusCreated, newSeries)
}

// Handler para actualizar una serie
func updateSeries(c *gin.Context) {
	db := c.MustGet("db").(*sqlx.DB)
	id := c.Param("id")

	var updateData Series
	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Verificar que la serie existe
	var exists bool
	err := db.Get(&exists, "SELECT EXISTS(SELECT 1 FROM series WHERE id = $1)", id)
	if err != nil || !exists {
		c.JSON(http.StatusNotFound, gin.H{"error": "Series not found"})
		return
	}

	_, err = db.Exec(`
		UPDATE series 
		SET title = $1, description = $2, status = $3, 
			current_episode = $4, total_episodes = $5, score = $6
		WHERE id = $7
	`, updateData.Title, updateData.Description, updateData.Status,
		updateData.CurrentEpisode, updateData.TotalEpisodes, updateData.Score, id)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Series updated successfully"})
}

// Handler para eliminar una serie
func deleteSeries(c *gin.Context) {
	db := c.MustGet("db").(*sqlx.DB)
	id := c.Param("id")

	result, err := db.Exec("DELETE FROM series WHERE id = $1", id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Series not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Series deleted successfully"})
}

// Handler para actualizar el estado de una serie (PATCH)
func updateStatus(c *gin.Context) {
	db := c.MustGet("db").(*sqlx.DB)
	id := c.Param("id")

	var request struct {
		Status string `json:"status" binding:"required"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Validar el estado
	validStatus := map[string]bool{
		"pending":   true,
		"watching":  true,
		"completed": true,
	}

	if !validStatus[request.Status] {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid status"})
		return
	}

	_, err := db.Exec("UPDATE series SET status = $1 WHERE id = $2", request.Status, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Status updated successfully"})
}

// Handler para incrementar el episodio (PATCH)
func incrementEpisode(c *gin.Context) {
	db := c.MustGet("db").(*sqlx.DB)
	id := c.Param("id")

	// Primero obtenemos el episodio actual
	var current, total int
	err := db.QueryRow(`
		SELECT current_episode, total_episodes 
		FROM series WHERE id = $1
	`, id).Scan(&current, &total)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Series not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Verificamos que no exceda el total de episodios
	if current >= total {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Already at the last episode"})
		return
	}

	// Incrementamos el episodio
	_, err = db.Exec(`
		UPDATE series 
		SET current_episode = current_episode + 1 
		WHERE id = $1
	`, id)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Episode incremented successfully"})
}

// Handler para aumentar puntuación (PATCH)
func upvoteSeries(c *gin.Context) {
	db := c.MustGet("db").(*sqlx.DB)
	id := c.Param("id")

	_, err := db.Exec(`
		UPDATE series 
		SET score = score + 1 
		WHERE id = $1
	`, id)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Score increased successfully"})
}

// Handler para disminuir puntuación (PATCH)
func downvoteSeries(c *gin.Context) {
	db := c.MustGet("db").(*sqlx.DB)
	id := c.Param("id")

	_, err := db.Exec(`
		UPDATE series 
		SET score = score - 1 
		WHERE id = $1
	`, id)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Score decreased successfully"})
}
