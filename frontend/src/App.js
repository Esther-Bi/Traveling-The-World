import { useEffect, useState } from "react";
import ReactMapGL, {Marker} from 'react-map-gl';
import * as React from 'react';
import Map, {Popup} from 'react-map-gl';
import { Room, Star, StarBorder } from "@material-ui/icons";
import "./app.css";
import axios from "axios";
import { format } from "timeago.js";


function App() {
  const myStorage = window.localStorage;
  const [currentUsername, setCurrentUsername] = useState(myStorage.getItem("user"));
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);

  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
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

  const handleLogout = () => {
    setCurrentUsername(null);
    myStorage.removeItem("user");
  };

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <Map
        {...viewport}
        mapboxAccessToken = {process.env.REACT_APP_MAPBOX}
        width="100%"
        height="100%"
        transitionDuration="200"
        mapStyle="mapbox://styles/safak/cknndpyfq268f17p53nmpwira"
        onViewportChange = {(nextViewport) => setViewport(nextViewport)}
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

              offsetLeft={-20}
              offsetTop={-10}
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
      </Map>
    </div>
  );
}

export default App;
