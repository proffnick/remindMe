import React from "react";
import { 
        FloatingLabel,
        Form,
        Col, 
        Row } from "react-bootstrap";
import { InputElement } from "./inputElement";
import { animateCSS } from "../../utils";
import { useTypes } from "../../hooks/remind/useTypes_mql";
import { useTopics } from "../../hooks/remind/useTopics_mql";

export const LearnSelection = ({ upDateSelection, addty, addto, item }) => {
    // list all the available topic and subjects
    const addType   = React.useRef(null);
    const addTopic  = React.useRef(null);

    const typeControl   = React.useRef(null);
    const topicControl  = React.useRef(null);

    const typeRef       = React.useRef(null);
    const topicRef      = React.useRef(null);

    const { types }     = useTypes();
    const { topics }    = useTopics();
    const updated       = React.useRef(null);

    React.useEffect(() => {
         //console.log(topics);
         // whenever there is a change to any of these please rerender
         if(item && !updated.current){
            updated.current = true;
            upDateSelection('TYPE', item.type);
            upDateSelection('TOPIC', item.topic);
         }

    }, [types, topics, item]);

    const toggleAddresource = ( what ) => {
        let icon;
        let text;
        if(what === 'type' && typeControl.current){
            if(typeControl.current.classList.contains('d-none')){
                icon = addType.current.querySelector('.bi');
                text = addType.current.querySelector('.type-text');
                //addType
                typeControl.current.classList.remove('d-none');
                animateCSS(`#${typeControl.current.id}`, 'zoomIn');
                icon.classList.remove('bi-plus-circle-dotted');
                icon.classList.add('bi-dash-circle-dotted');
                text.innerText = "I'm Done";
                addType.current.classList.remove('btn-outline-primary');
                addType.current.classList.add('btn-outline-danger');

            }else{
                icon = addType.current.querySelector('.bi');
                text = addType.current.querySelector('.type-text');
               //addType
               animateCSS(`#${typeControl.current.id}`, 'zoomOut');
               setTimeout(() => {
                typeControl.current.classList.add('d-none');
               }, 500);
               

               icon.classList.remove('bi-dash-circle-dotted');
               icon.classList.add('bi-plus-circle-dotted');
               text.innerText = "Add New";
               addType.current.classList.remove('btn-outline-danger');
               addType.current.classList.add('btn-outline-primary');
                
            }
        }
        if(what === 'topic' && topicControl.current){
            if(topicControl.current.classList.contains('d-none')){
                icon = addTopic.current.querySelector('.bi');
                text = addTopic.current.querySelector('.topic-text');
                //addType
                topicControl.current.classList.remove('d-none');
                animateCSS(`#${topicControl.current.id}`, 'zoomIn');
                icon.classList.remove('bi-plus-circle-dotted');
                icon.classList.add('bi-dash-circle-dotted');
                text.innerText = "I'm Done";
                addTopic.current.classList.remove('btn-outline-primary');
                addTopic.current.classList.add('btn-outline-danger');

            }else{
                icon = addTopic.current.querySelector('.bi');
                text = addTopic.current.querySelector('.topic-text');
               //addType
               animateCSS(`#${topicControl.current.id}`, 'zoomOut');
               setTimeout(() => {
                topicControl.current.classList.add('d-none');
               }, 500);
               
               icon.classList.remove('bi-dash-circle-dotted');
               icon.classList.add('bi-plus-circle-dotted');
               text.innerText = "New Topic";
               addTopic.current.classList.remove('btn-outline-danger');
               addTopic.current.classList.add('btn-outline-primary');
                
            }
        }
    }

    const printTypes = React.useMemo(() => {
        if(item){
            return types.map((type, index) => {
                if(item.type === type.type){typeRef.current.value = item.type; }
                return <option  key={index} value={type.type}>{type.type}</option>
                }
            );
        }

        if(!item){
            return types.map((type, index) => <option key={index} value={type.type}>{type.type}</option>)
        }
        
    }, [types, item]);

    const printTopics = React.useMemo(() => {

        if(item){
            return topics.map((topic, index) => 
            {
                if(item.topic === topic.topic){topicRef.current.value = topic.topic;}
                return <option key={index} value={topic.topic}>{topic.topic}</option>
            }
            );
        }

        if(!item){
            return topics.map((topic, index) => <option  key={index} value={topic.topic}>{topic.topic}</option>)
        }   
        
    }, [topics, item]);

    return(
        <Row className="g-0 animate__animated animate__zoomIn">
            <Col sm>
            <FloatingLabel controlId="floatingSelectType" label="What's New ?">
                <Form.Select
                 ref={typeRef}
                 defaultValue={item?.type}
                 onChange={(e) => upDateSelection('TYPE', e.target.value)}
                 className="border-end rounded-0 rounded-start" aria-label="What user wants to learn">
                    <option value=''>Select Type</option>
                    {printTypes}
                </Form.Select>
            </FloatingLabel>
            <div className="me-2 my-1">
                <span 
                    onClick={() => toggleAddresource('type')}
                    className="float-end btn btn-sm btn-outline-primary rounded-pill border-0 px-2 " ref={addType}>
                 <i className="bi bi-plus-circle-dotted"></i> <span className="type-text">Add New</span>
                </span>
            </div>
            <div    ref={typeControl} 
                    className="d-none my-2" 
                    id='typeToggle'>
                <InputElement collector={addty} />
            </div>
            </Col>
            <Col sm>
                <FloatingLabel controlId="floatingSelectTopic" label="What is the subject or topic?">
                    <Form.Select 
                        ref={topicRef}
                        defaultValue={item?.topic}
                        onChange={(e) => upDateSelection('TOPIC', e.target.value)}
                        className="border-start-0 rounded-0 rounded-end" aria-label="Learning Topic">
                        <option>Select Topic</option>
                        { printTopics }
                    </Form.Select>
                </FloatingLabel>
                <div className="me-2 mt-1">
                    <span 
                        onClick={() => toggleAddresource('topic')}
                        className="float-end btn btn-sm btn-outline-primary rounded-pill border-0 px-2" 
                        ref={addTopic}>
                      <i className="bi bi-plus-circle-dotted"></i> <span className="topic-text">New Topic</span>
                    </span>
                </div>
                <div 
                    ref={topicControl} 
                    className="d-none my-2" 
                    id='topicToggle'>
                    <InputElement collector={addto} />
                </div>
            </Col>
        </Row>
    );
}