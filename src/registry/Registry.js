import React, { useState } from "react";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";

import handleLogIn from "./Common/UtilityFunction";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
// should save isLogined as a global varible
// once fetch it grom the backend, it should perserved
// the global value should only be toogle when user logged in or logged out

// /auth/signin
const Registry = (props) => {
    const [form, setForm] = useState({ email: "", password: "", name: "" });
    const dispatch = useDispatch();
    let history = useHistory();

    return (
        <>
            <h1 className="login-heading">Registry </h1>

            <Form
                className="login-form"
                onSubmit={(e) => {
                    e.preventDefault();
                    let result = handleLogIn(dispatch, form, history);
                    console.log("registry: " + result);
                    if (!result) {
                        alert("Registry failed");
                    }
                }}
            >
                <FormGroup>
                    <Label for="exampleName">Name</Label>
                    <Input
                        type="name"
                        name="name"
                        id="exampleName"
                        placeholder="name"
                        value={form.name}
                        onChange={(e) =>
                            setForm({ ...form, name: e.target.value })
                        }
                    />
                </FormGroup>
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

export default Registry;
