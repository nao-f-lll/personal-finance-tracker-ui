package storage

import (
	"database/sql"
	"errors"
	"time"

	"github.com/google/uuid"
	_ "github.com/lib/pq"
	"github.com/tanq16/expenseowl/internal/config"
)

var ErrExpenseNotFound = errors.New("expense not found")

type Storage interface {
	SaveExpense(expense *config.Expense) error
	GetAllExpenses() ([]*config.Expense, error)
	DeleteExpense(id string) error
	EditExpense(expense *config.Expense) error
}

type postgresStore struct {
	db *sql.DB
}

func NewPostgresStore(connStr string) (*postgresStore, error) {
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		return nil, err
	}
	if err := db.Ping(); err != nil {
		return nil, err
	}
	return &postgresStore{db: db}, nil
}

func (s *postgresStore) SaveExpense(expense *config.Expense) error {
	if expense.ID == "" {
		expense.ID = uuid.New().String()
	}
	if expense.Date.IsZero() {
		expense.Date = time.Now()
	}
	_, err := s.db.Exec(
		`INSERT INTO expenses (id, name, category, amount, date) VALUES ($1, $2, $3, $4, $5)`,
		expense.ID, expense.Name, expense.Category, expense.Amount, expense.Date,
	)
	return err
}

func (s *postgresStore) GetAllExpenses() ([]*config.Expense, error) {
	rows, err := s.db.Query(`SELECT id, name, category, amount, date FROM expenses`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var expenses []*config.Expense
	for rows.Next() {
		var e config.Expense
		if err := rows.Scan(&e.ID, &e.Name, &e.Category, &e.Amount, &e.Date); err != nil {
			return nil, err
		}
		expenses = append(expenses, &e)
	}
	return expenses, nil
}

func (s *postgresStore) DeleteExpense(id string) error {
	res, err := s.db.Exec(`DELETE FROM expenses WHERE id = $1`, id)
	if err != nil {
		return err
	}
	n, _ := res.RowsAffected()
	if n == 0 {
		return ErrExpenseNotFound
	}
	return nil
}

func (s *postgresStore) EditExpense(expense *config.Expense) error {
	res, err := s.db.Exec(
		`UPDATE expenses SET name = $1, category = $2, amount = $3, date = $4 WHERE id = $5`,
		expense.Name, expense.Category, expense.Amount, expense.Date, expense.ID,
	)
	if err != nil {
		return err
	}
	n, _ := res.RowsAffected()
	if n == 0 {
		return ErrExpenseNotFound
	}
	return nil
}
