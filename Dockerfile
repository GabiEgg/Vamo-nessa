FROM node:22-alpine
WORKDIR /app
COPY package.json build.js index.html ./
COPY js ./js
COPY data ./data
COPY server ./server
ENV NODE_ENV=production PORT=3000 DB_PATH=/dados/dossie.db
RUN mkdir -p /dados && chown node:node /dados
VOLUME /dados
EXPOSE 3000
USER node
CMD ["node","--no-warnings=ExperimentalWarning","server/server.js"]
