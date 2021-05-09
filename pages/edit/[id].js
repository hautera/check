import { useState } from 'react'
import Head from 'next/head'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import styles from '../../styles/Edit.module.css'

export default function Home({ list }) {
    const tempList = list.items.map( (item) => {
        return {
            itemName : item,
            newItemField : false,
        }
    })
    tempList.push({ newItemField : true })
    const [name, setName] = useState(list.name)
    const [items, setItems] = useState(tempList)
    const [dragInd, setDragInd] = useState(-1)
    
    const NewItemInput = (props) => {
        const { ind } = props
        const [newItem, setNewItem] = useState('')
        return <div>
            <input value={newItem} onChange={e => setNewItem(e.target.value)}></input>
            <button onClick={e => { 
                const temp = {
                    itemName : newItem,
                    newItemField : false,
                }
                addItem(ind, temp)
                setNewItem('')
            }}>Add</button>
        </div>
    }

    const removeItem = (ind) => {
        const newList = items.slice()
        const itemRemoved = newList.splice(ind, 1)
        //console.log(newList)
        setItems(newList)
        return itemRemoved
    }


    const addItem = (ind, item) => {
        const newList = items.slice()
        newList.splice(ind, 0, item)
        console.log(newList)
        setItems(newList)
    }

    const shiftItem = (oldInd, newInd) => {
        const newList = items.slice()
        const itemRemoved = newList.splice(oldInd, 1)[0]
        newList.splice(newInd, 0, itemRemoved)
        setItems(newList)
    }

    const ItemList = ({ items }) => {
        return items.map( (item, ind) => {
            const {newItemField, itemName} = item 
            if(newItemField)
                return <div key={ind} 
                            onMouseUp={ e => stopDrag(ind)}>
                        <FontAwesomeIcon icon={faBars}
                        onMouseDown={e => startDrag(ind, e)} />
                        <NewItemInput ind={ind}></NewItemInput>
                    </div>
             else 
                return <div key={ind} 
                            onMouseUp={ e => stopDrag(ind)}
                            className={styles.noSelect}>
                        <FontAwesomeIcon icon={faBars}
                        onMouseDown={e => startDrag(ind, e)} />
                    {itemName} <button onClick={event => removeItem(ind)}>Delete</button>
                </div>
            
        })
    }

    const startDrag = (targetInd, e) => {
        setDragInd(targetInd)
    }

    const stopDrag = (ind) => {
        if( dragInd !== -1 ) {
            shiftItem(dragInd, ind)
        }
        setDragInd(-1)
    }

    //TODO make the damn thing move with the mouse while we drag it
    const drag = (e) => {
        if (dragInd >= 0) {
            console.log(e)
            e.target.style = {
                paddingTop : '5rem'
            }
        } 
    }

    return (<div>
        <Head>
            <title>Edit List</title>
        </Head>
        <input value={name} onChange={event => setName(event.target.value)}></input>
        <ol>
            <ItemList items={items}/>
        </ol>
    </div>)
}

export async function getStaticPaths() {
    // Return a list of possible value for id
    try {
        const res = await fetch('http://localhost:3000/api/')
        const data = await res.json()
        const { ls } = data
        ls.push({_id : 'new'})
        //console.log(ls)
        const p = {paths : ls.map( li => {
            return {params : {id : li._id}}
        }), fallback : false}
        return p
    } catch (err) {
        console.error(err)
        return { fallback : true }
    }
}

export async function getStaticProps({params}) {
    const { id } = params
    if (id === 'new' ){
        return {
            props : {
                list : {
                    name : 'New List',
                    items : [],
                    newList : true,
                }
            }
        }
    }
    try {
        const res = await fetch(`http://localhost:3000/api/${id}`)
        const { list }= await res.json() 

        return { props : {list} }
    } catch (err) {
        return {props: { fallback : true, error : String(err) }}
    }
}