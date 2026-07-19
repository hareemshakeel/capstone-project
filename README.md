# capstone-project

A capstone project for the AI-assisted development track. This repository tracks setup, tooling, and iterative build work using Claude Code and Cursor.

## Tech Stack

- **Frontend:** React (functional components and hooks)
- **Backend:** Express REST API
- **Database:** MongoDB

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS)
- [MongoDB](https://www.mongodb.com/) (local install or [Atlas](https://www.mongodb.com/cloud/atlas))
- Git

### Setup

```bash
git clone https://github.com/hareemshakeel/capstone-project.git
cd capstone-project
cp .env.example .env
```

Fill in `.env` values (especially `MONGODB_URI` and `JWT_SECRET`), then install and run both apps:

```bash
# Backend
cd server
npm install
npm run dev

# Frontend (new terminal)
cd client
npm install
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

### Profile Settings

1. Sign up or log in at `/register` or `/login`.
2. Open **Profile Settings** at `/settings`.
3. Edit email, phone number, date of birth, and address, then save.
4. Change your password in the separate password section.

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Log in |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/users/profile` | Update profile fields |
| PUT | `/api/users/password` | Change password |

## Contributing

- Use [Conventional Commits](https://www.conventionalcommits.org/) for all commit messages.
- Use `camelCase` for variables/functions and `PascalCase` for React components.
- Store secrets in `.env` — never commit environment files.
- Prefer explicit error handling over silent failures.

## License

MIT — see [LICENSE](LICENSE).
