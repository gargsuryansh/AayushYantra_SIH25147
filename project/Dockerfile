# Use Python 3.11 slim as the base image
FROM python:3.11-slim

# Install system dependencies
# curl/gnupg needed for installing nodejs
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js 20
RUN mkdir -p /etc/apt/keyrings
RUN curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
RUN echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_20.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list
RUN apt-get update && apt-get install -y nodejs

# Set work directory
WORKDIR /app

# 1. Install Python dependencies
# Copy requirements first to leverage caching
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 2. Install Node.js dependencies
COPY package.json package-lock.json* ./
RUN npm install

# 3. Copy application code
COPY . .

# 4. Build the Next.js application
RUN npm run build

# Expose the port Next.js runs on
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]
