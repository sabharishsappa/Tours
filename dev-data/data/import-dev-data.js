require('dotenv').config();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const Tour = require("../../models/tourModel")
const fs = require("fs");
// database

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`));

const DB = process.env.DATABASE.replace(
  `<PASSWORD>`,
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => console.log('Database connection Successful'))

  const deleteData = async()=>{
    try{
        await Tour.deleteMany();
        console.log("Data Deleted Successfully");
    }
    catch(err){
        console.log(err);
    }
    process.exit();
  }

  const importData = async ()=>{
    try{
        await Tour.create(tours);
        console.log("Data Imported Successfully");
    }
    catch(err){
        console.log(err);
    }

    process.exit();
  }

  if(process.argv[2] === "--import")
  {
    importData();
  }

  else if(process.argv[2] === "--delete")
{
  deleteData()
  }