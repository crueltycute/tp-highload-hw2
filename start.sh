docker build -t node .
docker run -d -p 80:8000 -p 8080:8080 node:latest