import React from 'react';
import { FormControl, InputGroup } from "react-bootstrap";

export const InputElement = ({ collector, classes, placeholder, buttonText, update, item }) => {
    const save  = React.useRef(null);
    const input = React.useRef(null);
    const thereisItem = React.useRef(null);


    React.useEffect(() => {
        if(item && thereisItem.current === null && update){
            // console.log('We got here successfully');
            thereisItem.current = true;
            update(item.content);
        }
    }, [item, thereisItem, update] );
    
    const saveInput = async (e) => {
        e.preventDefault();
        const oldText = e.target.innerText;
        e.target.disabled = true;
        e.target.innerText = "Wait..";
        if(input.current){
            if(input.current.value.trim() || update){
                await collector(input.current.value.trim(), false);
            }
        }
        e.target.disabled = false;
        e.target.innerText = oldText;
    }

    return(
        <>
        <InputGroup className="mb-3">
            <FormControl
            ref={input}
            size='lg'
            defaultValue={item? item.content: ''}
            placeholder={`${placeholder ? placeholder: 'Enter value'}`}
            aria-label={`${placeholder ? placeholder: 'Enter value'}`}
            aria-describedby="entered-value"
            className={`${classes}`}
            onKeyUp={(e) => {
                //console.log(e.target);
                if(e.target.value && update){
                    //console.log('Yes key went up');
                    update(e.target.value);
                }
            }}
            />
            <InputGroup.Text 
            className={`btn btn-primary entered-value ${classes}`}
            onClick={(e) => saveInput(e)}  
            ref={save}><span className='align-middle'>{`${buttonText ? buttonText : (item ? ' Update': ' Save')}`}</span></InputGroup.Text>
        </InputGroup>
        </>
    );
}