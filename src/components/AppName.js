import React            from "react";
import Navbar           from 'react-bootstrap/Navbar';
import  logo            from "./images/logo.png";
import './App.css';
export const API_TYPE_NAME = "RemindMe";

export function AppName() {
  return (
    <Navbar.Brand href="/#" className="my-0 py-0 me-1">
     <img
      alt={`RemindMe`} 
      src={logo} 
      className="img-thumbnail reme-logo  rounded-circle"/>
    </Navbar.Brand>
  );
}
