# /backend/Dockerfile
FROM node:20

# Install the compilers your project needs (C, Java, Python)
RUN apt-get update && apt-get install -y \
    python3 \
    default-jdk \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy your entire backend code
COPY . .

EXPOSE 5000

# Start your server
CMD ["node", "server.js"]