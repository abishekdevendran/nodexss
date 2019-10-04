FROM node:latest
WORKDIR /usr/src/app
COPY package.json .
RUN npm install --production --save
RUN npm install express xss
COPY server.js .
RUN ls -la
EXPOSE 8080
CMD [ "node", "server.js" ]
