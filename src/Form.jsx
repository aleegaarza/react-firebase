import React from "react";
import useForm from "./useForm";
import { fireStore } from "./firebase/firebase";
import Button from "./components/Button";

const Form = (
    { data = [],
        setData,
        user, }
) => {
    const [value, handleInput, setValue] = useForm({
        tweet: ""
    })
    const { tweet } = value;

    function handleSubmit(e) {
        e.preventDefault()
        //Adding tweets
        const newTweet = {
            ...value,
            uid: user.uid,
            email: user.email,
            author: user.displayName
        }

        const addTweet = fireStore.collection('tweets').add(newTweet)
        //reference of created document
        const getDoc = addTweet.then(doc => (doc.get()))
        //getting tweets
        getDoc.then(doc => {
            const currentTweet = {
                tweet: doc.data().tweet,
                author: doc.data().author,
                id: doc.id,
                uid: doc.data().uid,
                email: doc.data().email

            }
            setData([
                currentTweet,
                ...data
            ])

        })

        setValue({
            tweet: ""
        })


    }

    return (
        <form>
            <textarea
                name='tweet'
                value={tweet}
                onChange={handleInput} >

            </textarea>

            <Button onClick={handleSubmit}>
                Submit
            </Button>
        </form>
    )
}

export default Form;