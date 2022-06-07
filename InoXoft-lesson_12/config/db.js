module.exports = {
  BACKEND_IP: process.env.BACKEND_IP || 'localhost:3000',
  mongoURI: process.env.mongoURI || 'mongodb://localhost:27017/inoxsoft-lesson-4',
  PORT: process.env.PORT || 3000,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || 'word',
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || 'word'
};
