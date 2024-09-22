
# Notes App

A simple notes management web application where users can create, view, edit, and delete notes. This app is built using React for the frontend and Node.js with Express.js for the backend.

## Live Demo

Try the app live: [Notes App](https://notes-eight-ashen.vercel.app/)

## Features

- **Create Notes**: Add new notes easily.
- **View Notes**: See a list of all your saved notes.
- **Edit Notes**: Modify the content of any note.
- **Delete Notes**: Remove notes you no longer need.
- **Responsive Design**: Works well on both desktop and mobile devices.
- **Persistent Data**: Notes are stored securely on the backend.

## Technologies Used

### Frontend

- **React.js**: JavaScript library for building user interfaces.
- **CSS**: Styling the user interface.
- **Axios**: For making HTTP requests to the backend.

### Backend

- **Node.js**: JavaScript runtime for server-side programming.
- **Express.js**: Fast, minimalist web framework for Node.js.
- **MongoDB**: NoSQL database for storing notes.
- **Mongoose**: MongoDB object modeling tool.
- **Cors**: Middleware to allow cross-origin requests.

### Hosting

- **Vercel**: The frontend is deployed on Vercel.

---

## Getting Started

Follow these steps to run the project locally.

### Prerequisites

Ensure you have the following installed on your machine:

- **Node.js**: [Install Node.js](https://nodejs.org/)
- **MongoDB**: [Install MongoDB](https://www.mongodb.com/try/download/community)
- **Git**: [Install Git](https://git-scm.com/)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/notes-app.git
   cd notes-app
   ```

2. **Install dependencies:**

   Navigate to the backend folder and install backend dependencies:

   ```bash
   cd backend
   npm install
   ```

   Navigate to the frontend folder and install frontend dependencies:

   ```bash
   cd ../frontend
   npm install
   ```

### Configuration

1. **Backend Configuration:**

   In the `backend` directory, create a `.env` file and add the following environment variables:

   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   ```

2. **Frontend Configuration:**

   In the `frontend` directory, create a `.env` file and add the following:

   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

### Running the Application

1. **Start the Backend:**

   Open a terminal, navigate to the `backend` folder, and run:

   ```bash
   npm start
   ```

   The backend will start running on `http://localhost:5000`.

2. **Start the Frontend:**

   Open another terminal, navigate to the `frontend` folder, and run:

   ```bash
   npm run dev
   ```

   The frontend will start running on `http://localhost:5173`.


### Deployment

1. **Frontend Deployment:**

   - You can deploy the frontend on [Vercel](https://vercel.com/).
   - Push the frontend folder to your GitHub repository and connect it to Vercel.

2. **Backend Deployment:**

   - Deploy the backend on [Vercel](https://vercel.com/) or any other cloud platform that supports Node.js.
   - Make sure to configure the MongoDB connection string for the production environment.

---

## API Endpoints

### Base URL: `http://localhost:5000/api/`

- **GET /notes**: Fetch all notes
- **POST /notes**: Create a new note
- **PUT /notes/:id**: Update a specific note
- **DELETE /notes/:id**: Delete a specific note

---

## Contributing

Feel free to open issues and submit pull requests. Contributions are welcome!

---

## License

This project is licensed under the MIT License.
