import React        from "react";
import { Link }     from "react-router-dom";
import '../App.css';

export const Navigation = ({ link, text }) => {
    return(
        <div className="my-3">
            <Link 
            className="btn btn-outline-light btn-sm text-center border-0"
            to={link}
            > <i className="bi bi-arrow-left-circle fs-2 text-primary align-middle"></i>  <span className="align-middle">{text}</span>
            </Link>
        </div>
    );
}