import { useRef, useState } from "react";
import "./login.css"
import axios from "axios";
import { Cancel, Room } from "@material-ui/icons";

export default function Login({setShowLogin, setCurrentUsername, myStorage}) {
    const [error, setError] = useState(false);
    const nameRef = useRef();
    const passwordRef = useRef();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = {
            username:nameRef.current.value,
            password:passwordRef.current.value,
        };
        try{
            const res = await axios.post("/users/login" , user);
            myStorage.setItem("user",res.data.username);
            setCurrentUsername(res.data.username);
            setShowLogin(false);
            setError(false);
        } catch(err){
            setError(true);
        }
    }

    return (
        <div className="loginContainer">
            <div className="logo">
                <Room className="logoIcon" />
                <span>Esther's Traveling The World Website</span>
            </div>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="username" ref={nameRef}/>
                <input type="password" placeholder="password" ref={passwordRef}/>
                <button className="loginBtn">Login</button>
                {error && <span className="failure">Something went wrong..</span>}
            </form>
            <Cancel className="loginCancel" onClick={()=>setShowLogin(false)}/>
        </div>
    );
}