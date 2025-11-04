# TempMail.io - Temporary Email Service

A stunning, modern dark-themed temporary email service built with React and Node.js. Generate disposable email addresses that expire after 1 hour with a beautiful glassmorphism UI.

## Features

- 🎯 **Instant Email Generation** - Create temporary email addresses with one click
- 📨 **Real-time Inbox** - Auto-refreshing inbox to receive emails instantly
- 🎨 **Modern UI** - Beautiful, responsive design with TailwindCSS
- ⏰ **Auto-Expiry** - Emails automatically expire after 1 hour for privacy
- 📋 **Copy to Clipboard** - Easy one-click copying of email addresses
- 🗑️ **Email Management** - Mark as read and delete emails
- 🎭 **Demo Mode** - Test the service with simulated emails

## Tech Stack

### Frontend
- **React 18** - Modern UI library
- **Vite** - Fast build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **Axios** - HTTP client

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **UUID** - Unique ID generation
- **CORS** - Cross-origin resource sharing

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Setup

1. **Clone or navigate to the project directory**
   ```bash
   cd c:\xampp\htdocs\tempmailgb.com
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

## Running the Application

### Start the Backend Server

```bash
cd backend
npm start
```

The backend will run on `http://localhost:5000`

For development with auto-restart:
```bash
npm run dev
```

### Start the Frontend

Open a new terminal:

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:3000` and open automatically in your browser.

## Usage

1. **Generate Email**: Click the "Generate Email Address" button to create a new temporary email
2. **Copy Email**: Click the copy icon to copy the email address to your clipboard
3. **Test It**: Click "Send Demo Email" to simulate receiving an email
4. **View Emails**: Click on any email in the inbox to view its content
5. **Delete Emails**: Click the trash icon to delete emails
6. **Auto-Refresh**: The inbox automatically checks for new emails every 5 seconds

## API Endpoints

### POST `/api/generate`
Generate a new temporary email address
- **Response**: `{ success: true, email: string, expiresIn: number }`

### GET `/api/inbox/:email`
Get all emails for a specific address
- **Response**: `{ success: true, emails: Array }`

### POST `/api/simulate-receive`
Simulate receiving an email (for demo purposes)
- **Body**: `{ to: string, from: string, subject: string, body: string }`
- **Response**: `{ success: true, message: string }`

### PUT `/api/email/:emailAddress/:emailId/read`
Mark an email as read
- **Response**: `{ success: true, message: string }`

### DELETE `/api/email/:emailAddress/:emailId`
Delete an email
- **Response**: `{ success: true, message: string }`

### GET `/api/health`
Health check endpoint
- **Response**: `{ status: "ok" }`

## Project Structure

```
tempmailgb.com/
├── backend/
│   ├── server.js           # Express server and API routes
│   └── package.json        # Backend dependencies
├── frontend/
│   ├── src/
│   │   ├── App.jsx         # Main React component
│   │   ├── main.jsx        # React entry point
│   │   └── index.css       # Global styles with Tailwind
│   ├── index.html          # HTML template
│   ├── vite.config.js      # Vite configuration
│   ├── tailwind.config.js  # Tailwind configuration
│   ├── postcss.config.js   # PostCSS configuration
│   └── package.json        # Frontend dependencies
└── README.md               # This file
```

## Features Explained

### Email Expiry
- Emails are stored in memory and expire after 1 hour
- A cleanup job runs every minute to remove expired emails
- This ensures user privacy and keeps the system clean

### Demo Mode
- Since this is a demo application, it includes a "Send Demo Email" button
- In production, you would integrate with a real SMTP server to receive emails

## Production Deployment

For production use, you would need to:

1. **Set up a real mail server** (e.g., using Postfix, Haraka, or a service like SendGrid)
2. **Configure DNS records** (MX records for your domain)
3. **Add a database** (e.g., MongoDB, PostgreSQL) instead of in-memory storage
4. **Implement authentication** (if needed)
5. **Add rate limiting** to prevent abuse
6. **Use environment variables** for configuration
7. **Deploy to a hosting service** (e.g., Heroku, DigitalOcean, AWS)

## Security Notes

- This is a demo application with in-memory storage
- Do not use this for sensitive information
- In production, implement proper security measures:
  - Rate limiting
  - Input validation
  - XSS protection
  - CSRF tokens
  - HTTPS only

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License - feel free to use this project for learning or as a starting point for your own temporary email service.

## Contributing

Feel free to submit issues and enhancement requests!

## Support

For questions or issues, please create an issue in the project repository.
