//dependencies
import React, { useEffect, useState } from 'react';

//firebase
import { auth, fireStore, loginWithGoogle, logout } from './firebase/firebase';


//components
import Form from './Form';

//styles
import logobig from "./logobig.svg";
import like from "./like.svg";
import deleteIcon from "./deleteIcon.svg"
import './index.css';


export default function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favs, setFavs] = useState([]);
  const [view, setView] = useState("feed");
  const [user, setUser] = useState(null);

  //Authentication
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
            likes
          } = doc.data();

          const snap = {
            tweet,
            author,
            id: doc.id,
            email,
            uid,
            likes

          };
          tweets.push(snap);
        })
        setData(tweets);
        setFavs(tweets.filter(item => {
          return item.likes > 0;
        }
        ))
        setLoading(false)
      });

    auth.onAuthStateChanged((user) => {
      console.warn("LOGGED WIDTH:", user);
      setUser(user);

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
      fireStore.doc(`tweets${id}`).delete();
    }
  }

  //like tweets
  function likeTweet(id, likes) {
    const innerLikes = likes || 0;
    fireStore.doc(`tweets/${id}`).update({ likes: innerLikes + 1 })
  }

  return (

    <div className="App">
      <header>
        <div >
          <img src={logobig} alt="" />
        </div>
      </header>


      <section className='login' >
        {user && (
          <div>
            <Form data={data}
              setData={setData}
              user={user || {}} />
            <p>Hola {user.displayName} </p>
            <img src={user.photoURL} alt={user.displayName} referrerPolicy="no-referrer" s />

          </div>
        )}
        <button className='btn-login' type='button' onClick={user ? logout : loginWithGoogle} >
          {user ? "cerrar" : "iniciar"} sesión
        </button>
      </section>

      {loading ? <h2>Cargando</h2> :
        <section className='tweets'>
          <button type='button' onClick={() => setView("feed")} >Tweets</button>
          <button type='button' onClick={() => setView("favs")} >Favs</button>


          {(view === "feed" ? data : favs).map(item => (
            <div key={item.id} className="tweet">
              <div className='tweet-content'>
                <p> @<strong>{item.author} </strong></p>
                <p>Tweet: {item.tweet} </p>
                <div className='tweet-actions' >
                  <button className='likes'
                    onClick={() => likeTweet(item.id, item.likes)} >
                    <img src={like} alt="like" />
                    <span>
                      {item.likes || 0}
                    </span>
                  </button>

                  {
                    (user !== null && user.uid === item.uid) &&
                    <button className='delete'
                      onClick={() => deleteTweet(item.id)} >
                      <img src={deleteIcon} alt="" />
                    </button>
                  }

                </div>
              </div>



            </div>
          ))}

        </section>
      }
    </div>
  );
}
