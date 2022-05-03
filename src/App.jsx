//dependencies
import React, { useEffect, useState } from 'react';

//firebase
import { fireStore, logout, auth, loginWithGoogle } from './firebase/firebase';


//components
import Form from './Form';

//styles
import like from "./like.svg";
import deleteIcon from "./deleteIcon.svg";
import './index.css';
import logobig from "./logobig.svg";


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
        snapshot.forEach(doc => {
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
          tweets.unshift(snap);
        })
        setData(tweets);
        // setFavs(tweets.filter(item => {
        //   return item.likes > 0;
        // }
        // ))
        setLoading(false);
      });

    auth.onAuthStateChanged((user) => {
      setUser(user)

      if (user) {
        fireStore.collection("users").get()
          .then(snapshot => {
            snapshot.forEach(doc => {

              const userDoc = doc.data()
              if (userDoc.uid === user.uid) {

                setUser({
                  ...user, ...userDoc
                })
              }

            })
          })
      }
    });
    return () => { disconnect() }
  }, []);

  useEffect(() => {
    if (user) {
      if (data.length && user.favorites && user.favorites.length) {
        const favorites = user.favorites.map(favId => {
          const tweetFav = data.find(item => item.id === favId)
          return tweetFav
        })
          .filter(item => item !== undefined)
        setFavs(favorites)

      }
      const fileUser = fireStore.collection('users').where("uid", "==", user.uid).get()
      fileUser.then((res) => {

        if (res.empty) {
          fireStore.collection('users').add({
            uid: user.uid,
            name: user.displayName,
            photo: user.photoURL,
            email: user.email,
            favorites: []
          });
        }



      })

    }
  }, [user, data])

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
    fireStore.collection("users")
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          const userDoc = doc.data()
          if (userDoc.uid === user.uid) {
            fireStore.doc(`users/${doc.id}`).update({
              favorites: [...userDoc.favorites, id]

            })
          }

        })

      })
    setUser({
      ...user, favorites: [...user.favorites, id]
    })
  }




  return (

    <div className="App centered">


      <section className='login' >
        {user === null &&

          <div className='home' >
            <div>
              <img className='imglogo' src={logobig} alt="" />
              <p className='welcome' >Bienvenido al mundo de los desarrolladores</p>
            </div>
          </div>
        }

        {user && (
          <div className='user-info' >
            <p>Hola {user.displayName} </p>
            <img src={user.photoURL} alt={user.displayName} referrerPolicy="no-referrer" />
          </div>
        )}

        <button className='btn-login' type='button' onClick={user ? logout : loginWithGoogle} >
          {user ? 'cerrar' : 'iniciar'} sesión
        </button>
      </section>

      {user && (
        <Form data={data}
          setData={setData}
          user={user || {}} />
      )}




      {user && (

        <>
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
                  <p>{item.email} </p>
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
        </>
      )}





    </div>

  );
}
