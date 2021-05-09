const mongoose = require('mongoose')
import { connectToDb, getList } from '../../models/connect'

export default async (req, res) => {
    const { id } = req.query
    var List
    try {
        List = await getList()
        await connectToDb()
    } catch (err) {
        console.error(err)
        res.status(500).json({error : 'Error connecting to database'})
        return 
    }

    if ( req.method === 'GET' ) {
        //get the specfic list of things
        const list = await List.findById(id)
        res.status(200).json({list})
    }

    if ( req.method === 'DELETE' ) {
        const list = await List.findOneAndDelete({ _id : id })
        res.status(200).json({list})
    }
}
