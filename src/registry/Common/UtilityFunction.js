import {
    registryFailure,
    registrySuccess,
    registryRequest,
} from "../../main_page/redux/actions";

// dispatch is a react hook, it must be passed in from the body of the component
// all three list need to be passed in as well
const handleLogIn = (dispatch, form, history) => {
    dispatch(registryRequest());
    // console.log(JSON.stringify(form));
    fetch("http://localhost:5000/auth/signup", {
        method: "post",
        headers: {
            "Access-Control-Allow-Origin": "http://127.0.0.1:5000",
            "Access-Control-Allow-Credentials": true,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
    })
        .then((res) => {
            console.log(res);
            if (res.ok) {
                console.log(res);
                dispatch(registrySuccess(res));
                // i think it has the smilar effect as a link
                // but you don't have to create a html element
                console.log("registry sucesfully");
                history.push("/");
                return true;
            } else {
                dispatch(registryFailure("Registry failed"));
                return false;
            }
        })
        .catch((error) => {
            dispatch(registryFailure(error.message));
            return false;
        });
};

export default handleLogIn;
