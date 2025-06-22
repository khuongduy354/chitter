FROM node:latest 
WORKDIR /app 
COPY . .
RUN npm install 

# testing only, dont provide credentials in real world 

EXPOSE 8000  

CMD ["npm","run","dev"]