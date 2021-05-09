require('dotenv').config()
const mongoose = require('mongoose')

export async function connectToDb() {
    if (mongoose.connections[0].readyState) return;

    const db_url = process.env.DB_PASSWORD
    await mongoose.connect( db_url, { useNewUrlParser : true, useUnifiedTopology : true, }, (err) => {
        if (err) {
            console.error(err)
        } else {
            console.log("Connected to database")
        }
    })
}

export async function getList() {
    try {
        return require('./List')
      } catch (err) {
        if(err.name === 'OverwriteModelError') {
          return mongoose.model('List')
        } else {
            console.error(err)
            return null
        }
      }
}