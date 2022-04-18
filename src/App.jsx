//dependencies
import React, { useEffect, useState } from 'react';

//firebase
import { auth, fireStore, loginWithGoogle, logout } from './firebase/firebase';


//components
import Form from './Form';
import Login from './components/pages/Login';

//styles
import like from "./like.svg";
import deleteIcon from "./deleteIcon.svg";
import './index.css';


export default function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favs, setFavs] = useState([]);
  const [view, setView] = useState("feed");
  const [user, setUser] = useState(null);

  useEffect(() => {

    const disconnect = fireStore.collection("tweets")
      .onSnapshot((snapshot) => {
        const tweets = [];
        snapshot.forEach((doc) => {
          const {
            tweet,
            author,
            email,
            uid,
            likes,
            photoURL,
          } = doc.data();

          const snap = {
            tweet,
            author,
            id: doc.id,
            email,
            uid,
            photoURL,
            likes

          };
          tweets.push(snap);
        })
        setData(tweets);
        setFavs(tweets.filter(item => {
          return item.likes > 0;
        }
        ))
      });

    return () => { disconnect() }
  }, []);

  //delete tweet
  const deleteTweet = (id) => {
    const confirmDelete = window.confirm("Estás seguro que quieres borrar este tweet?");
    if (confirmDelete) {
      const updatedTweets = data.filter((tweet) => {
        return tweet.id !== id
      });

      setData(updatedTweets);
      fireStore.doc(`tweets/${id}`).delete();
    }
  }

  //like tweets
  function likeTweet(id, likes) {
    const innerLikes = likes || 0;
    fireStore.doc(`tweets/${id}`).update({ likes: innerLikes + 1 })
  }

  return (

    <div className="App centered">

      <Login 
      user={user}
      setUser={setUser}
      data={data}
      setData={setData}
      />

      
      

      {user && (
        <Form data={data}
          setData={setData}
          user={user || {}} />


      )}


      <section className='favs' >
        <button className='btn-feed' type='button' onClick={() => setView("feed")} >Tweets</button>
        <button className='btn-favs' type='button' onClick={() => setView("favs")} >Favs</button>
      </section>

      <section className='tweets'>
        
        
      {loading ? <p>cargando</p> : null}


        {(view === "feed" ? data : favs).map(item => (
          <div key={item.id} className="tweet">
            <div className='tweet-content'>
              <img src={item.photoURL} alt="" />
              <p> @<strong>{item.author} </strong></p>
              <p>Tweet: {item.tweet} </p>

            </div>
            <div className='tweet-actions' >
              <button className='likes'
                onClick={() => likeTweet(item.id, item.likes)} >
                <img src={like} alt="like" />
                <span>
                  {item.likes || 0}
                </span>
              </button>
            </div>

            {
              (user !== null && user.uid === item.uid) &&
              <button className='delete'
                onClick={() => deleteTweet(item.id)} >
                <img src={deleteIcon} alt="" />
              </button>
            }


          </div>
        ))}

      </section>

    </div>
  );
}
