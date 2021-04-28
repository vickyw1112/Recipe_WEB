import React, { useState } from "react";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";
import "./css/LogIn.css";
import handleLogIn from "./Common/UtilityFunction";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import Alert from "./component/Alert";
// should save isLogined as a global varible
// once fetch it grom the backend, it should perserved
// the global value should only be toogle when user logged in or logged out

// /auth/signin
const LogIn = (props) => {
    const [form, setForm] = useState({ email: "", password: "" });
    const dispatch = useDispatch();
    let history = useHistory();
    // has alert
    const [alert, setAlert] = useState("");

    return (
        <>
            {alert && (
                <Alert
                    message={alert}
                    color="danger"
                    className="login-alert"
                    resetState={() => setAlert("")}
                />
            )}
            <h1 className="login-heading">LogIn </h1>

            <Form
                className="login-form"
                onSubmit={(e) => {
                    e.preventDefault();
                    let result = handleLogIn(dispatch, form, history);

                    if (!result) {
                        setAlert("Login failed, please try again");
                    }
                }}
            >
                <FormGroup>
                    <Label for="exampleEmail">Email</Label>
                    <Input
                        type="email"
                        name="email"
                        id="exampleEmail"
                        placeholder="email"
                        value={form.email}
                        onChange={(e) =>
                            setForm({ ...form, email: e.target.value })
                        }
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="examplePassword">Password</Label>
                    <Input
                        type="password"
                        name="password"
                        id="examplePassword"
                        placeholder="password"
                        value={form.password}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                password: e.target.value,
                            })
                        }
                    />
                </FormGroup>

                <Button type="submit" className="login-button">
                    Submit
                </Button>
            </Form>
        </>
    );
};

export default LogIn;
