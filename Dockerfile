FROM golang:alpine AS builder

WORKDIR /app

COPY . .

RUN go build -o expenseapp ./cmd/expenseapp  # Update this line if the path is different

FROM alpine:latest

WORKDIR /app

RUN mkdir -p /app/data

COPY --from=builder /app/expenseapp .

EXPOSE 8080

# Run the server
CMD ["./expenseapp"]
