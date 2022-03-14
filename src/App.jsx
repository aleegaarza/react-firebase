import React, { useEffect, useState} from 'react';
import { fireStore } from './firebase/firebase';
import './index.css';
import Form from './Form';


export default function App() {
  const [data, setData]=useState([]);
  const [loading, setLoading]=useState(true);
  const [favs, setFavs]=useState([]);
  const [view, setView]=useState("feed");


  useEffect(()=>{
    const unsuscribe = 
    fireStore.collection('tweets')
    .onSnapshot((snapshot)=>{
      const tweets = []
      snapshot.forEach(doc=>{
        const snap= {
          tweet: doc.data().tweet,
          author: doc.data().author,
          id: doc.id,
          likes: doc.data().likes
        }
        tweets.push(snap)

      } )
      setData(tweets);
      setFavs(tweets.filter(item => {
          return item.likes > 0;
        }
      ) )
      setLoading(false)
    } );
    return () => {
      unsuscribe()
    }
    
  },[] );

  const deleteTweet=(id) => {
    const confirmDelete = window.confirm("Estás seguro que quieres borrar este tweet?");
    if(confirmDelete){
      const updatedTweets=data.filter((tweet) => {
        return tweet.id !== id 
      } )

    

    setData(updatedTweets);
    fireStore.doc(`tweets${id}`).delete();
  }
}
  function likeTweet(id, likes){
    const innerLikes = likes || 0;
    console.log(id);
    fireStore.doc(`tweets/${id}`).update({likes: innerLikes + 1 })
  }

  return (
    <div className="App">
      <h1>Hello world</h1>
      <Form data={data} setData={setData} />
      {loading ? <h2>Cargando</h2> : 
      <section className='tweets'>
        <button type='button' onClick={()=> setView("feed") } >Tweets</button>
        <button type='button' onClick={()=> setView("favs") } >Favs</button>


      {(view === "feed" ? data : favs).map(item =>(
          <div key={item.id} className="tweet">
          <div className='tweet-content'>
          <p>Tweet: {item.tweet} </p>
          <p> Autor: <strong>{item.author} </strong></p>
          </div>
          <div className='tweet-actions' >
            <button className='likes'
            onClick={()=> likeTweet(item.id, item.likes)} >
              <img src="" alt="like" />
              <span>
                {item.likes || 0}
              </span>
            </button>
          </div>
          <button className='delete' 
          onClick={()=> deleteTweet(item.id) } >x</button>
          <hr/>

          </div>
        ))}

      </section>
        }
    </div>
  );
}
