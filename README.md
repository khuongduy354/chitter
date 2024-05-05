# Chitter
A realtime chat app, with customizeable themes, emojis and parallax backgrounds for chat room.
Frontend: https://github.com/khuongduy354/chitter-fe

# Features  
- Google OAuth Authentication
- 1-1 realtime chat
- Groups: create groups, realtime group chat
- Add Friends 
- Upload custom emojis and use for chat messages
- Parallax Background editor and apply these backgrounds for chat panel 
- Save themes configs: message colors, backgrounds used,...

# Why   
- Messager app default themes aren't enough for me, I want themes (backgrounds, msg colors,...) to be created by users. 
- Message Panel receives lots of scrolling by users, and I notice Parallax Background also works best by scrolling, so I combine the two.

# Quick Start 
```
git clone https://github.com/khuongduy354/chitter.git 
cd chitter
npm install  
npm run dev
``` 

# Run with Docker 
1. Place kafka folder (contain binaries and libs) in ./Dockerbuild  
2. Run commands in order
```python 
# in root 
docker build -f Dockerbuild/Dockerfile-gopgms -t chitter/go-ms:1.0 . 
docker build -f Dockerbuild/Dockerfile-express -t chitter/express-server:1.0 .  

// fix to correct versions of the 2 above container in .yml file
docker compose up 
``` 
3. go-ms should print Received message & Written to MongoDB after done 
Setup example: https://github.com/segmentio/kafka-go/tree/main/examples

# Tech Stack  
- Typescript 
- Express.js  
- Socket.io
- Supabase 
- MongoDB 
- Multer


