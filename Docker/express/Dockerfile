FROM node:latest 
WORKDIR /app 
COPY . .
RUN npm install 

# testing only, dont provide credentials in real world 
ENV SUPABASE_URL=https://oeuvmrrvzwmiyhbknqct.supabase.co
ENV SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ldXZtcnJ2endtaXloYmtucWN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDM0MDQ3NjQsImV4cCI6MjAxODk4MDc2NH0.ESbePTSeL2iWwZ39WVaL2A1a_zGbpF3UedPGG_FgUhU 
ENV MONGODB_STRING=mongodb+srv://khuongduy354:123@cluster0.zgxhbcg.mongodb.net/?retryWrites=true&w=majority  
ENV KAFKA_URL=kafka:9092

EXPOSE 8000  

CMD ["npm","run","dev"]