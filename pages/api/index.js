import { getList, connectToDb } from '../../models/connect'

export default async (req, res) => {
  try {  
    await connectToDb()
    const List = await getList()
    const ls = await List.find()
    res.status(200).json({ ls })
  } catch (err) {
    console.error(err)
    res.status(400).json({ fallback : true })
  }
}
