import React from "react";
import { Container, FormControl, FloatingLabel, Row, Col, Form } from "react-bootstrap";
import { WithTextEditor } from "./textEditor";
import { WithCodeEditor } from './codeEditor';
import { InputElement } from "./inputElement";


export const WritingModule  = ({ inputType, manageTitle, manageContent, item }) => {
    const [mode, setMode]   = React.useState({current: "text"});
    const editorSection     = React.useRef(null);
    const makeReplacements  = React.useCallback(() => {
            if(editorSection.current){
                // replace the bold Icon
                //console.log('I got here');
                if(editorSection.current.querySelector('button.fa-bold')){
                    editorSection.current.querySelector('button.fa-bold').innerHTML = '<i class="bi bi-type-bold"></i>';
                }
                if(editorSection.current.querySelector('button.fa-italic')){
                    editorSection.current.querySelector('button.fa-italic').innerHTML = '<i class="bi bi-type-italic"></i>';
                }
                if(editorSection.current.querySelector('button.fa-underline')){
                    editorSection.current.querySelector('button.fa-underline').innerHTML = '<i class="bi bi-type-underline"></i>';
                }
                if(editorSection.current.querySelector('button.fa-link')){
                    editorSection.current.querySelector('button.fa-link').innerHTML = '<i class="bi bi-link-45deg"></i>';
                }
                if(editorSection.current.querySelector('button.fa-align-center')){
                    editorSection.current.querySelector('button.fa-align-center').innerHTML = '<i class="bi bi-text-center"></i>';
                }
                if(editorSection.current.querySelector('button.fa-align-left')){
                    editorSection.current.querySelector('button.fa-align-left').innerHTML = '<i class="bi bi-text-left"></i>';
                }
                if(editorSection.current.querySelector('button.fa-align-right')){
                    editorSection.current.querySelector('button.fa-align-right').innerHTML = '<i class="bi bi-text-right"></i>';
                }
                if(editorSection.current.querySelector('button.fa-undo')){
                    editorSection.current.querySelector('button.fa-undo').innerHTML = '<i class="bi bi-arrow-counterclockwise"></i>';
                }
                if(editorSection.current.querySelector('button.fa-redo')){
                    editorSection.current.querySelector('button.fa-redo').innerHTML = '<i class="bi bi-arrow-clockwise"></i>';
                }
            }
    }, [editorSection]);
    const added             = React.useRef(null);
    const defaultItem       = React.useRef(null);

    React.useEffect(() => {
        makeReplacements();
        if(item && added.current !== true){
            added.current = true;
            inputType(item.mode);
            manageTitle(item.title);
            defaultItem.current.value = item.mode;
        }
    }, [makeReplacements, mode, item, added]);

    const modeChange = (e) => {
        const targetValue = e.target.value;
        //console.log(targetValue, 'Trageted value');
        switch (targetValue) {
            case 'text':
                //console.log('We got here text');
                setMode({...mode, current: targetValue});
                break;
            case 'code':
                //console.log('We got here code');
                setMode({...mode, current: targetValue});
                break;
            case 'link':
                //console.log('We got here link');
                setMode({...mode, current: targetValue});
                break;
            default:
                return;
        }

        inputType(targetValue);
    }


    return(
        <Container className="m-0 p-0 mt-3">
            <Row className="g-0 animate__animated animate__zoomIn mb-3">
                <Col className="col-4">
                    <FloatingLabel controlId="floatingSelectContentType" label="Editor Mode">
                        <Form.Select
                        ref={defaultItem}
                        defaultValue={`${item? item.mode: 'text'}`} 
                        onChange={(e) => modeChange(e)}
                        className="border-end rounded-0 rounded-start" 
                        aria-label="What user wants to learn">
                            <option>Select Type</option>
                            <option value="text">Text</option>
                            <option value="code">Code</option>
                            <option value="link">Link</option>
                        </Form.Select>
                    </FloatingLabel>
                </Col>
                <Col className="col-8">
                    <FloatingLabel controlId="floatingSelectContentTitle" label="Title of content">
                        <FormControl
                        type="text" 
                        defaultValue={item ? item?.title: ''}
                        onChange={(e) => manageTitle(e.target.value)}
                        className="border-end rounded-0 rounded-end"
                        placeholder="What have you discovered ?" 
                        aria-label="What user wants to learn" />
                    </FloatingLabel>
                </Col>
            </Row>
            <div ref={editorSection} className="mt-3 animate__animated animate__zoomIn">

                {
                    item ? (
                        item.mode === 'text'?
                        <WithTextEditor item={item} manageContent={manageContent} />:
                        item.mode === 'code'? 
                        <WithCodeEditor item={item} manageContent={manageContent} language={'javascript'} />: 
                        <InputElement item={item} collector={manageContent} placeholder="Enter Url" />
                    ):
                    (
                        mode.current === 'text'?
                        <WithTextEditor item={item} manageContent={manageContent} />:
                       mode.current === 'code' ? 
                        <WithCodeEditor item={item} manageContent={manageContent} language={'javascript'} />: 
                        <InputElement item={item} collector={manageContent} placeholder="Enter Url" /> 
                    )
                }
            </div>
        </Container>
    );
}