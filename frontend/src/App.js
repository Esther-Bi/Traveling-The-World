import { useEffect, useState } from "react";
import * as React from 'react';
import Map, {Marker, Popup} from 'react-map-gl';
import { Room, Star, StarBorder } from "@material-ui/icons";
import "./app.css";
import axios from "axios";
import { format } from "timeago.js";
import 'mapbox-gl/dist/mapbox-gl.css';
import Register from "./components/Register";
import Login from "./components/Login";



function App() {
  const myStorage = window.localStorage;
  const [currentUsername, setCurrentUsername] = useState(myStorage.getItem("user"));
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [rating, setRating] = useState(0);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [viewport, setViewport] = useState({
    latitude: 46,
    longitude: 17,
    zoom: 4
  });

  useEffect(() => {
    const getPins = async () => {
      try{
        const res = await axios.get("/pins");
        setPins(res.data);
      } catch(err){
        console.log(err)
      }
    };
    getPins()
  }, [])

  const handleMarkerClick = (id, lat, long) => {
    setCurrentPlaceId(id);
    setViewport({ ...viewport, latitude: lat, longitude: long });
  };

  const handleAddClick = (e) => {
    const longitude = e.lngLat.lng;
    const latitude = e.lngLat.lat;
    setNewPlace({
      lat: latitude,
      long: longitude,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // prevenr refreshing page
    const newPin = {
      username: currentUsername,
      title: title,
      desc: desc,
      rating: rating,
      lat: newPlace.lat,
      long: newPlace.long,
    };

    try {
      const res = await axios.post("/pins", newPin);
      setPins([...pins, res.data]);
      setNewPlace(null);
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = () => {
    myStorage.removeItem("user");
    setCurrentUsername(null);
  };


  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <Map
        {...viewport}
        mapboxAccessToken = {process.env.REACT_APP_MAPBOX}
        transitionDuration="100"
        onMove={e => setViewport(e.viewport)}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        onDblClick={currentUsername && handleAddClick}
      >
        {pins.map(p => (
          <>
            <Marker
              latitude={p.lat}
              longitude={p.long}
              color={currentUsername  === p.username ? "tomato" : "slateblue"}
              onClick = {e => {
                e.originalEvent.stopPropagation();
                handleMarkerClick(p._id,p.lat,p.long);
              }}
            >
            </Marker>

            {p._id === currentPlaceId && (
              <Popup
                latitude={p.lat}
                longitude={p.long} 
                closeButton={true}
                closeOnClick={false}
                onClose={() => setCurrentPlaceId(null)}
                anchor="left"
                >
                <div className="card">
                  <label>Place</label>
                  <h4 className='place'>{p.title}</h4>
                  <label>Review</label>
                  <p className='desc'>{p.desc}</p>
                  <label>Rating</label>
                  <div className="stars">
                    {Array(p.rating).fill(<Star className="star" />)}
                  </div>
                  <label>Information</label>
                    <span className='username'>Created by <b>{p.username}</b></span>
                    <span className='date'>{format(p.createdAt)}</span> 
                </div>
              </Popup> 
            )}
          </>
        ))}

        {newPlace && (
          <Popup
            latitude={newPlace.lat}
            longitude={newPlace.long}
            closeButton={true}
            closeOnClick={false}
            onClose={() => setNewPlace(null)}
            anchor="left"
          >
            <div>
                <form onSubmit={handleSubmit}>
                  <label>Title</label>
                  <input
                    placeholder="Enter a title"
                    autoFocus
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <label>Description</label>
                  <textarea
                    placeholder="Tell us something about this place."
                    onChange={(e) => setDesc(e.target.value)}
                  />
                  <label>Rating</label>
                  <select onChange={(e) => setRating(e.target.value)}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                  <button type="submit" className="submitButton">
                    Add Pin
                  </button>
                </form>
            </div>
          </Popup>
        )}

        {currentUsername ? (
          <button className="button logout" onClick={handleLogout}>log out</button>
        ) : (
          <div className="buttons">
            <button className="button login" onClick={()=>setShowLogin(true)}>Login</button>
            <button className="button register" onClick={()=>setShowRegister(true)}>Register</button>
          </div>
        )}
        {showRegister && <Register setShowRegister={setShowRegister}/>}
        {showLogin && <Login setShowLogin={setShowLogin} myStorage={myStorage} setCurrentUsername={setCurrentUsername} />}

      </Map>
    </div>
  );
}

export default App;
