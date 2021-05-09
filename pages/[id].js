import Link from 'next/link'

export default function Home(props) {
    const { fallback, list } = props
    if(fallback) {
        return <div>
            <Link href='/'><p>Back</p></Link>
            <h1>Error Loading List :(</h1>
        </div>
    } 

    const { items, name, _id } = list 
    const list_items = items.map( (item, index) => {
        return <li key={index}>
            {item}
        </li>
    })

    return <div>
        <Link href='/'><p>Back</p></Link>
        <h1>
            {name}
        </h1>
        <ol>
            {list_items}
        </ol>
    </div>
}

export async function getStaticPaths() {
    // Return a list of possible value for id
    try {
        const res = await fetch('http://localhost:3000/api/')
        const data = await res.json()
        return {paths : data.ls.map( li => `/${li._id}` ), fallback : false}
    } catch (err) {
        console.error(err)
        return { fallback : true }
    }
}

export async function getStaticProps({params}) {
    const { id } = params
    try {
        const res = await fetch(`http://localhost:3000/api/${id}`)
        const { list }= await res.json() 

        return { props : {list} }
    } catch (err) {
        return {props: { fallback : true, error : String(err) }}
    }
}