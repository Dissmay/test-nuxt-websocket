FROM node:16.13

WORKDIR /

COPY package*.json ./

RUN npm install

ADD . .

# RUN npm run build

CMD ["npm", "run", "dev"]
