import React from "react";
import { Navbar, Container, Button } from "react-bootstrap";
import '../App.css';

export const NavigationBar = ({ logOut, currentUser, AppName }) =>{

    return (
        <Navbar sticky="top" bg="white" expand='lg' className="border-bottom animate__animated animate__slideInDown">
            <Container className="d-flex justify-content-center">
                <AppName />
                {currentUser ? (
                    <>
                    <Button 
                        className="btn-sm me-1 reme-logo mt-1 text-center p-1 aligh-middle rounded-circle"
                        variant="outline-primary" 
                        >
                     <i className="bi bi-gear "></i>
                    </Button>
                    <Button
                    className="btn-sm reme-logo p-1 mt-1 text-center rounded-circle"
                    variant="outline-secondary"
                    color="secondary"
                    onClick={async () => {
                        await logOut();
                    }}
                    >
                    <i className="bi bi-box-arrow-right text-danger"></i>
                    </Button>
                    </>
                ) : null}
            </Container>
      </Navbar>
    );
}