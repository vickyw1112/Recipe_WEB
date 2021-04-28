import React, { useState } from "react";
import {
    Collapse,
    Navbar,
    NavbarToggler,
    Nav,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Button,
    NavbarBrand,
} from "reactstrap";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import "./css/NavBar.css";
import { logout } from "../main_page/redux/actions";

const NavBar = (props) => {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);
    const loginStatus = useSelector((state) => state.login.loggedIn);
    const dispatch = useDispatch();
    //dispatch action set logout in redex
    let userRegistry;
    if (loginStatus) {
        userRegistry = (
            <Link to="/">
                <Button
                    outline
                    color="secondary"
                    className="navbar-button"
                    onClick={() => {
                        fetch("http://localhost:5000/auth/logout", {
                            method: "POST",
                            credentials: "include",
                            headers: {
                                "Access-Control-Allow-Origin":
                                    "http://127.0.0.1:5000",
                                "Access-Control-Allow-Credentials": true,
                            },
                        })
                            .then((res) => res.json())
                            .then((result) => console.log(result));
                        dispatch(logout());
                    }}
                >
                    Logout
                </Button>
            </Link>
        );
    } else {
        userRegistry = (
            <Link to="/">
                <Button outline color="secondary" className="navbar-button">
                    Login
                </Button>
            </Link>
        );
    }
    return (
        <Navbar color="light" light expand="md">
            <NavbarBrand className="brand">
                <Link to="/search">SO YUMMY</Link>
            </NavbarBrand>
            <NavbarToggler onClick={toggle} />
            <Collapse isOpen={isOpen} navbar>
                <Nav className="mr-auto" navbar>
                    <NavItem>
                        <NavLink style={{ opacity: 0 }}>Components</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink style={{ opacity: 0 }}>GitHub</NavLink>
                    </NavItem>
                    <UncontrolledDropdown nav inNavbar>
                        <DropdownToggle nav caret style={{ opacity: 0 }}>
                            Options
                        </DropdownToggle>
                        <DropdownMenu right>
                            <DropdownItem>Option 1</DropdownItem>
                            <DropdownItem>Option 2</DropdownItem>
                            <DropdownItem divider />
                            <DropdownItem>Reset</DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </Nav>

                {userRegistry}
                <Link to="/registry">
                    <Button outline color="secondary" className="navbar-button">
                        Register
                    </Button>
                </Link>
                <Link to="/settings">
                    <Button outline color="secondary" className="navbar-button">
                        Settings
                    </Button>
                </Link>
            </Collapse>
        </Navbar>
    );
};

export default NavBar;
