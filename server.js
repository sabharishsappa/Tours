require('dotenv').config();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('Uncaught Exception💥,Shutting Down...');
  process.exit(1);
});

// database

const DB = process.env.DATABASE.replace(
  `<PASSWORD>`,
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Database connection Successful'));

// Server

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log('Server running on port 3000');
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('Unhandled Rejection💥,Shutting Down...');
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', ()=>{
  console.log('SIGTERM RECEIVED. Shutting down gracefully');
  server.close(()=>{
    console.log('💥 Process Terminated!');
  })
})
