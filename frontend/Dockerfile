FROM node:14

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy application code
COPY . .

EXPOSE 3000

# Start the development server
CMD ["npm", "start"]
