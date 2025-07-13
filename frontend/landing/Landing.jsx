import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
    // Callable variables
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Values
    const mode = useSelector((state) => state.mode);
    const user = useSelector((state) => state.user);

    const toggleMode = () => {
        dispatch({
            type: 'SET_MODE',
            payload: mode === 'dark' ? 'light' : 'dark',
        });
    };

    useEffect(() => {
        if(user.is_loaded) {
            if(user) {
                console.log(user.data)
            } else {
                navigate("/auth/login");
            }
        }
    }, [user.is_loaded]);

    return (
        <>
            <button onClick={toggleMode}>
                Switch to {mode === 'dark' ? 'Light' : 'Dark'} Mode
            </button>
            {/* <p>{user?.email}</p> */}
        </>
    );
}

export default LandingPage;