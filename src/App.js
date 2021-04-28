import React from "react";
import NarBar from "./navbar/NavBar.js";
import MainPage from "./main_page/MainPage.js";
import LogIn from "./login/LogIn.js";
import Registry from "./registry/Registry";
import UserSettings from "./user_settings/UserSettings";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Recipe from "./recipe/Recipe";
import Verify from "./registry/component/Verify";
import "./app.css";
function App() {
    return (
        <Router>
            <NarBar />
            <Switch>
                <Route path="/" exact>
                    <LogIn />
                </Route>
                <Route path="/search" exact>
                    <MainPage />
                </Route>
                <Route path="/settings">
                    <UserSettings />
                </Route>
                <Route path="/registry">
                    <Registry />
                </Route>
                <Route path={`/recipe/:id`}>
                    <Recipe />
                </Route>
                <Route path={`/verify/:id`}>
                    <Verify />
                </Route>
            </Switch>
        </Router>
    );
}

export default App;
