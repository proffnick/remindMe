import React from "react";
import { TodoItemsPage }  from "../TodoItemsPage";
import { Navigation } from "../layout/navigation";
import Container from 'react-bootstrap/Container'

export const ToDo = () => {
    return(
        <Container className="col-11 col-lg-6 mx-auto">
            <Navigation link={'/'} text={'home'} />
            <TodoItemsPage />
        </Container>
    );
}