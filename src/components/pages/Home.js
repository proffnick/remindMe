import React from "react";
import { Link } from "react-router-dom";
import '../App.css';
import { animateCSS, addAndRemoveClass } from "../../utils";

export const Home = () => {
    const module = React.useRef(null);
    const intVal = React.useRef(null);
    

    const animate = React.useCallback(() => {

        intVal.current = setTimeout(() => {
            if(module.current){
                module.current.querySelectorAll('._icon').forEach((e) => {
                    switch(e.id){
                        case 'home_icon':
                            if(e.classList.contains('animate__animated')){
                                e.classList.remove("animate__animated", "animate__zoomIn");
                            }
                            setTimeout(()=>{
                                animateCSS('.home-icon', 'pulse');
                                addAndRemoveClass(e, 'text-info');
                            }, 400);
                            
                        break;
                        case 'learn_icon':
                            if(e.classList.contains('animate__animated')){
                                e.classList.remove("animate__animated", "animate__zoomIn");
                            }
                            setTimeout(()=>{
                                animateCSS('.learn-icon', 'heartBeat');
                                addAndRemoveClass(e, 'text-warning');
                            }, 600);
                            
                        break;
                        case 'search_icon':
                            if(e.classList.contains('animate__animated')){
                                e.classList.remove("animate__animated", "animate__zoomIn");
                            }
                            setTimeout(()=>{
                                animateCSS('.search-icon', 'pulse');
                                addAndRemoveClass(e, 'text-primary');
                            }, 900);
                            
                        break;
                        case 'todo_icon':
                            if(e.classList.contains('animate__animated')){
                                e.classList.remove("animate__animated", "animate__zoomIn");
                            }
                            setTimeout(()=>{
                                animateCSS('.todo-icon', 'pulse');
                                addAndRemoveClass(e, 'text-success');
                            }, 1100);
                            
                        break;
                        default:
                            return;
                    }
                    

                });
                animate();
            }
        }, 3000);
    }, [module]);

    React.useEffect(() => {
        animate();

        return () => {
            if(intVal.current){
                clearTimeout(intVal.current);
            }
        }
    }, [intVal, animate]);

    return (
        <div className="col-11 col-lg-3 mx-auto control-height pt-5">
            <p className="text-muted text-center fw-bold lh-2">What do you <br /> want to do?</p>
            <div ref={module} className="d-flex align-items-center justify-content-center flex-column control-height">
                <div className="d-flex justify-content-center flex-row">
                    <div className="text-center">
                        <Link id='home_icon' to="/" className="btn btn-outline-secondary border-0 border-start border-end home-icons rounded-0 border-bottom animate__animated animate__zoomIn _icon">
                            <i className="bi bi-house-door fs-1 home-icon d-inline-block"></i>
                            <small className="d-block">Home</small>
                        </Link>
                    </div>
                    <div className="text-center">
                        <Link id='learn_icon' to="/learn" className="btn btn-outline-secondary border-0 border-end home-icons rounded-0 border-bottom animate__animated animate__zoomIn _icon">
                            <i className="bi bi-lightbulb fs-1 learn-icon d-inline-block"></i>
                            <small className="d-block">Learn</small>
                        </Link>
                    </div>
                </div>
                <div className="d-flex justify-content-center flex-row">
                    <div className="text-center">
                        <Link id='search_icon' to="/search" className="btn btn-outline-secondary border-0 border-start border-end home-icons rounded-0 animate__animated animate__zoomIn _icon">
                            <i className="bi bi-search fs-1 search-icon d-inline-block"></i>
                            <small className="d-block">Search</small>
                        </Link>
                    </div>
                    <div className="text-center">
                        <Link id='todo_icon' to="/todo" className="btn btn-outline-secondary border-0 border-end home-icons rounded-0 animate__animated animate__zoomIn _icon">
                            <i className="bi bi-list-check fs-1 todo-icon d-inline-block"></i>
                            <small className="d-block">To Dos</small>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}