# TaskMaster - Premium Kanban Board

This is a beautifully designed, interactive Kanban board built with Vanilla HTML, CSS, and JavaScript. It features a sleek dark mode design with glassmorphism effects, drag-and-drop functionality, and local storage persistence.

## Features

- **Drag and Drop**: Seamlessly move tasks between "To Do", "In Progress", and "Done" columns.
- **Local Storage**: Your tasks are saved locally in your browser, so you won't lose them when you refresh.
- **Task Management**: Create new tasks with titles, descriptions, and priority levels.
- **Responsive Design**: Works gracefully on desktop and mobile devices.
- **Premium Aesthetics**: Dark mode, custom fonts (Outfit), glassmorphism, and smooth micro-animations.

## Technologies Used

- **HTML5**: Semantic document structure.
- **CSS3**: Variables, Flexbox, Grid layout, keyframe animations, and backdrop-filters.
- **Vanilla JavaScript (ES6)**: DOM manipulation, HTML5 Drag and Drop API, LocalStorage integration.
- **Docker**: Containerization using an Nginx lightweight alpine image.

## Running the Application Locally (No Docker)

You can simply open `index.html` in any modern web browser to view the application.

## Running with Docker

1. **Build the image**:
   ```bash
   docker build -t taskmaster-app .
   ```

2. **Run the container**:
   ```bash
   docker run -p 8080:80 -d taskmaster-app
   ```

3. **Access the application**:
   Open your browser and navigate to `http://localhost:8080`.

## DockerHub

The image for this application has been successfully built and pushed to DockerHub. 

* **DockerID**: `(Provide your DockerID here)`
* **Pull Command**: `docker pull your_dockerhub_username/taskmaster-app:v1`

## GitHub Repository
All source code files have been added to this project repository and it is accessible to the public.
