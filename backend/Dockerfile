FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --production

# Copy source
COPY . .

# Expose backend port
EXPOSE 3000

# Start server
CMD ["npm", "start"]
# or if your package.json has no start script, use:
# CMD ["node", "src/server.js"]
