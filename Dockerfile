FROM keymetrics/pm2:latest-stretch

WORKDIR /usr/src/app
# Bundle APP files
COPY . .
#COPY package.json .
#COPY ecosystem.config.js .


RUN pm2 install pm2-auto-pull
RUN pm2 install pm2-server-monit

# Install app dependencies
ENV NPM_CONFIG_LOGLEVEL warn
RUN npm install
# Show current folder structure in logs
#RUN ls -al -R

EXPOSE 3000
CMD [ "pm2-runtime", "start", "ecosystem.config.js" ]