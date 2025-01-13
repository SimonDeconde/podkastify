# Start with a base node image
FROM node:18-alpine as base

# Install PNPM
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

FROM base as install
# Copy the rest of the application
COPY . .
RUN pnpm install

FROM install as build
# Command to run on container start
CMD pnpm db:migrate && pnpm build && pnpm prod

FROM build as run
# Expose the ports your app uses
EXPOSE 3000 3001
