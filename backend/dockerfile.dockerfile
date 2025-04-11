# Build stage
FROM golang:1.21 as builder

WORKDIR /app
COPY . .

RUN go mod download
RUN CGO_ENABLED=0 GOOS=linux go build -o series-tracker .

# Runtime stage
FROM alpine:latest

WORKDIR /app
COPY --from=builder /app/series-tracker .

EXPOSE 8080
CMD ["./series-tracker"]