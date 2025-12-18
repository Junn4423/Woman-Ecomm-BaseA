FROM node:20-alpine

WORKDIR /srv/app

# Install dependencies for sharp
RUN apk add --no-cache libc6-compat

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
