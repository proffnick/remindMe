import React from "react";
import {Container, Row, Col, FloatingLabel, Form } from 'react-bootstrap';
import { Navigation }    from "../layout/navigation";
import { useTopics }     from "../../hooks/remind/useTopics_mql";
import { useTypes }      from "../../hooks/remind/useTypes_mql";
import { InputElement }  from '../layout/inputElement';
import { toast, ToastContainer }         from 'react-toastify';
import { useRemind }     from "../../hooks/remind/useRemind_mql";
import { PrintLastItem } from "../layout/printLastItem";
import { useShowLoader } from "../../hooks/util-hooks";
import { LinearProgress } from "@material-ui/core";

const reducer = (state, action) => {
    switch(action.type){
        case 'setType':
            return {
                ...state,
                type: action.payload
            }
        case 'setTopic':
            return {
                ...state,
                topic: action.payload
            }
        case 'setQuery':
            return {
                ...state,
                query: action.payload
            }
        default:
            return state;
    }
}

export const Search = () => {

    const { types }                 = useTypes();
    const { topics }                = useTopics();
    const [ state, dispatch]        = React.useReducer(reducer, {type: 'all', topic: '', query: '', limit: 5, skip: 5, page: 1});
    const [knowledge, setKnowledge]     = React.useState([]);
    // useRemindbring up serach
    const  { findAllRemind, reminds, loading } = useRemind();

    const printTypes = React.useMemo(() => {
        return types.map((type, index) => <option key={index} value={type.type}>{type.type}</option>)
    }, [types]);

    const printTopics = React.useMemo(() => {
        return topics.map((topic, index) => <option key={index} value={topic.topic}>{topic.topic}</option>)
    }, [topics]);

    const showError = (msg) => toast.error(msg, {position: toast.POSITION.TOP_CENTER});

    const notify    = (msg) => toast.info(msg, {position: toast.POSITION.TOP_CENTER});

    const success   = (msg) => toast.success(msg, {position: toast.POSITION.TOP_CENTER});

    // show loader
    const showLoader = useShowLoader(loading, 200);



    const setQuery = (query) => {

        if(query.length <= 255){
           // console.log('is working ', query);
            dispatch({type: 'setQuery', payload: query});
        }
        if(query.length > 255){
            showError('Query content too long!');
        }
        
    }

    const makeSearch = async () => {
        notify('Please wait. Searching..');
        const result = await findAllRemind(state);
        if(result.length){
            success('Successful! We found something!');
            setKnowledge(result);
        }

        if(!result.length){
            showError('No single record found matching your search. Refilter and try again.');
        }
    }

    const printResults = React.useMemo(() => {
        if(knowledge.length){
            return knowledge.map((know, index) => <div key={index}><PrintLastItem object={know} opt={false} notifier={null} /></div>);
        }
    }, [knowledge]);

    const printRecents = React.useMemo(() => {
        if(reminds.length){
            return reminds.map((know, index) => <div key={index}><PrintLastItem object={know} opt={false} notifier={null} /></div>);
        }
    }, [reminds]);

    return(
        <Container className="col-11 col-lg-6 mx-auto mb-5">
            <Navigation link={'/'} text={'home'} />
            <Form>
                <Row className="g-0 animate__animated animate__zoomIn">
                    <Col sm>
                        <FloatingLabel controlId="floatingSelectType" label="What's New ?">
                            <Form.Select 
                            onChange={(e) => dispatch({type: 'setType', payload: e.target.value})}
                            className="border-0 rounded-0 rounded-start" aria-label="What user wants to learn">
                                <option value=''>Select Type</option>
                                {printTypes}
                            </Form.Select>
                        </FloatingLabel>
                    </Col>
                    <Col sm>
                        <FloatingLabel controlId="floatingSelectTopic" label="What is the subject or topic?">
                            <Form.Select 
                                onChange={(e) => dispatch({type: 'setTopic', payload: e.target.value})}
                                className="border-0 border-start-0 rounded-0 rounded-end" aria-label="Learning Topic">
                                <option>Select Topic</option>
                                { printTopics }
                            </Form.Select>
                        </FloatingLabel>
                    </Col>
                </Row>
                <Row className="animate__animated animate__zoomIn">
                    <Col className="col-12">
                        <InputElement 
                            update={setQuery}
                            classes={`border-0`} 
                            collector={makeSearch} 
                            placeholder='Search your knowledge' 
                            buttonText="Search"/>
                    </Col>
                </Row>
            </Form>

            <div className="animate__animated animate__fadeIn">
                {knowledge.length ? 
                <div>
                    <h4 className="ps-3 border-start rounded-3 border-success border-3 fw-bolder fs-4 mb-3 text-success mb-0">Result:</h4>

                    { printResults }
                </div>
                : 
                <div>
                    <h4 className="ps-3 border-start rounded-3 border-success border-3 fw-bolder fs-4 mb-3 text-success mb-0">Recently Added knowledge:</h4>
                    {loading ? (
                        showLoader ? (
                        <LinearProgress />
                        ) : null
                    ) : ( printRecents )
                    }
                </div>
                }
            </div>
            <ToastContainer />
        </Container>
    );
}