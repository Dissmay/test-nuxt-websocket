FROM node:12.13-alpine

WORKDIR /

COPY package*.json ./

RUN npm install

ADD . .

RUN npm run build

CMD ["npm", "run", "dev"]
