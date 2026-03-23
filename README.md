# 🎓 LMS

Modern single-page application for the Learning Management System, built with **React** and **JavaScript**.

## Tech Stack

| Layer          | Technology                            |
| -------------- | ------------------------------------- |
| Framework      | React 18                              |
| Language       | JavaScript                            |
| Build Tool     | Vite 5                                |
| Styling        | Tailwind CSS 3                        |
| State          | Zustand                               |
| Routing        | React Router 6                        |
| HTTP Client    | Axios                                 |
| Animations     | Framer Motion                         |
| Icons          | Lucide React                          |
| Video Player   | react-youtube                         |


## Project Structure

```
src/
├── main.jsx             # Entry point — renders the React app
├── App.jsx              # Root component with routing setup
├── index.css            # Global styles / Tailwind directives
├── components/          # Reusable UI components
├── layouts/             # Page layout wrappers
├── lib/                 # API client & utility functions
├── pages/               # Route-level page components
│   ├── Home.jsx         # Landing / dashboard page
│   ├── Login.jsx        # User login
│   ├── Register.jsx     # User registration
│   ├── CoursePage.jsx   # Individual course view
│   ├── VideoPage.jsx    # Video player page
│   ├── SubjectIndex.jsx # Browse all subjects
│   ├── Profile.jsx      # User profile
│   ├── CartPage.jsx     # Shopping cart
│   ├── CheckoutPage.jsx # Checkout flow
│   └── ChatbotPage.jsx  # AI chatbot interface
├── store/               # Zustand state stores
```

## Getting Started

### Prerequisites

- **Node.js** ≥ 18

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_URL=http://localhost:5000
```

> All environment variables must be prefixed with `VITE_` to be available in the browser.

### Running

```bash
# Development server (hot-reload)
npm run dev

# Production build
npm run build

# Preview production build locally
npm run preview
```

### Linting

```bash
npm run lint
```

## Pages

| Page           | Route              | Description                     |
| -------------- | ------------------ | ------------------------------- |
| Home           | `/`                | Landing page / dashboard        |
| Login          | `/login`           | User authentication             |
| Register       | `/register`        | New user registration           |
| Subject Index  | `/subjects`        | Browse all available subjects   |
| Course         | `/course/:id`      | Course details & sections       |
| Video          | `/video/:id`       | Video player with progress      |
| Profile        | `/profile`         | User profile & settings         |
| Cart           | `/cart`            | Shopping cart                   |
| Checkout       | `/checkout`        | Purchase flow                   |
| Chatbot        | `/chat`            | AI-powered learning assistant   |

## Deployment

The frontend is configured for deployment on **Vercel** (see `vercel.json`).

```bash
npm run build   # Output → dist/
```

The `vercel.json` handles SPA routing (rewrites all paths to `index.html`).
