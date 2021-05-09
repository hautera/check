import Link from 'next/link'
import styles from '../styles/Home.module.css'
import { useState } from 'react'

export default function Home(props) {
  const [ls, setLs] = useState(props.list)

  const deleteList = async (id, ind) => {
    try {
      const res = await fetch(`http://localhost:3000/api/${id}`, { method : 'DELETE' })
      if(res.status === 200) {
        const newList = ls.slice()
        newList.splice(ind, 1)
        setLs(newList)
      }
    } catch(err) {
      console.error(err)
    }
    
  }

  const DeleteButton = (props) => {
      const { id, ind } = props
      return <button onClick={event => deleteList(id, ind)}>Delete</button>
  }

  const List = ({ls}) => {
    const [editing, setEditting] = useState(false)
    if(ls) {
      return ls.map( (el, ind) => {
        const {name, _id} = el
        return (
        <div key={ind}>
          <Link href={`/${_id}`}><h3>{ind}. {name}</h3></Link>
          <DeleteButton id={_id} />
        </div>)
      })
    } else {
      return ['Loading..', '', ''].map( (el, ind) => {
        return <div key={ind} className={styles.preLoad}>
          <h3>{ind} {el}</h3>
        </div>
      })
    }
  }
  return (
  <div>
    <h1>Lists</h1>
    <Link href='/edit/new'>
      <button>New</button>
    </Link>
    <ul>
      <List ls={ls} ></List>
    </ul>
  </div>)
}

export const getStaticProps = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/')
    const data = await res.json()
    return { props : { list : data.ls, } }
  } catch (err) {
    console.error(err)
    return { props : { fallback : true } }
  }
}