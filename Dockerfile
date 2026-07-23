# Use the official Nginx image as a lightweight web server
FROM nginx:alpine

# Copy all the files from the current directory to the default Nginx public folder
COPY . /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
