FROM golang:1.21.2

WORKDIR /usr/src/app

COPY . .
RUN go mod tidy