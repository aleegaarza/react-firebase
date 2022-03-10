import React from "react";
import useForm from "./useForm";
import { fireStore } from "./firebase/firebase";

const Form = (
    {data=[],
    setData}
) => {
    const [value, handleInput, setValue]=useForm({
        tweet:"",
        author:""
    })
    const {tweet, author} = value;

    function handleSubmit(e){
        e.preventDefault()
        const addTweet = fireStore.collection('tweets').add(value)
        const getDoc= addTweet.then(doc=>(doc.get()))
        getDoc.then(doc=>{
            const currentTweet={
                tweet: doc.data().tweet,
                author: doc.data().author, 
                id: doc.id
                
            }
            setData([
                currentTweet,
                ...data
            ])

        } )

        setValue({
            tweet:"",
            author:""
        })

        
    }

    return (
        <form>
            <textarea
            name='tweet'
            value={tweet}
            onChange={handleInput} >

            </textarea>
            <input type="text"
            name='author'
            placeholder="author"
            value={author}
            onChange={handleInput} />
            <button onClick={handleSubmit}>
                Submit
            </button>
        </form>
    )
}

export default Form;