import React from 'react';
import { CodeEditorEditable } from 'react-code-editor-editable';
import 'highlight.js/styles/dracula.css';
import Button from 'react-bootstrap/Button';

export const WithCodeEditor = ( { manageContent, language, item } ) => {
    let defaultLanguage = language ? language: 'html';
    const [value, setValue] = React.useState(`${defaultLanguage === 'html' ? '<div></div>': ''}`);
    const saveContent = () => {
        console.log(value);
        manageContent(value, false);
    };

    const isprinted = React.useRef(null);

    React.useEffect(() => {
        if(item && !isprinted.current){
            isprinted.current = true;
            setValue(decodeURIComponent(item.content));
        }
    }, [item, manageContent, setValue, value]);

    return(
        <>
        <CodeEditorEditable
            value={value}
            setValue={setValue}
            width='100%'
            height='300px'
            borderRadius="8px"
            language={defaultLanguage}
            inlineNumbers={true}
        />
        <Button
            onClick={saveContent}
            className='btn btn-sm btn-primary float-end mt-3'>
                <i className="bi bi-cloud-arrow-up"></i>{item ? ' Update': ' Save'} </Button>
        </>
    )
}