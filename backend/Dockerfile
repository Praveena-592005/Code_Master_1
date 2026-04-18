# Use Node.js as the base
FROM node:20

# Install Python, C++, and Java
RUN apt-get update && apt-get install -y \
    python3 \
    gcc \
    g++ \
    default-jdk \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy backend code
COPY . .

# Start the server
EXPOSE 10000
CMD ["node", "Server.js"]