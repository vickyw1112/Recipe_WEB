import {
    loginRequest,
    loginSuccess,
    loginFailure,
} from "../../main_page/redux/actions";

// dispatch is a react hook, it must be passed in from the body of the component
// all three list need to be passed in as well
const handleLogIn = (dispatch, form, history) => {
    dispatch(loginRequest());

    fetch("http://localhost:5000/auth/signin", {
        method: "POST",
        credentials: "include",
        headers: {
            "Access-Control-Allow-Origin": "http://127.0.0.1:5000",
            "Access-Control-Allow-Credentials": true,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
    })
        .then((res) => {
            if (res.ok) {
                console.log(res);
                dispatch(loginSuccess(res));
                // i think it has the smilar effect as a link
                // but you don't have to create a html element

                history.push("/search");
                return true;
            } else {
                dispatch(loginFailure("login failed"));
                return false;
            }
        })
        .catch((error) => {
            dispatch(loginFailure(error.message));
            return false;
        });
    return false;
};

export default handleLogIn;
