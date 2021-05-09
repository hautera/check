const mongoose = require('mongoose')

const ListSchema = mongoose.Schema({
    name : {
        type : String,
        required : true,
    }, 
    items : {
        type : Array,
        required : true,
    },
})

module.exports = mongoose.model( 'List', ListSchema )