import React from "react";
import { Routes, Route } from "react-router-dom";
import { Learn }    from "../pages/Learn";
import { ToDo }     from "../pages/ToDo";
import { Search }   from "../pages/Search";
import { Home }     from "../pages/Home";
import { Edit }     from "../pages/edit";


export const AppRouteProviser = () => {
    return(
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/learn"  element={<Learn />} /> 
            <Route path="/search" element={<Search />} />
            <Route path="/todo"   element={<ToDo />} /> 
            <Route path="/edit/:id"   element={<Edit />} />
        </Routes>
    );
}