import { useState } from "react";

const useForm = (initialState={} ) => {
    const [value,setValue]= useState(initialState);

    function handleInput({target}){
        setValue({
            ...value,
            [target.name]:target.value
        })
    }

    return[value,handleInput,setValue]
}

export default useForm;