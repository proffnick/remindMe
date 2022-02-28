import React from 'react';
import { TextEditor, getInnerHtml, addContentTo } from "text-editor-react";
import Button from 'react-bootstrap/Button';

export const WithTextEditor = ( { manageContent, item } ) => {
    let id          = "EditorId";
    const added     = React.useRef(null);

    const saveContent = () => {
        const content = getInnerHtml(id);
        manageContent(content, false);
    };

    React.useEffect(() => {
        if(item && !added.current){
            added.current = true;
            addContentTo(item.content, id);
            manageContent(item.content, true);
        }
    }, [item, manageContent, addContentTo, added]);

    return(
        <>
        <TextEditor
            id={id}
            showJustify={true}
            showUndoRedo={true}
            showHeadings={true}
            editorStyle={{
                maxHeight: 200+'px',
                overflowY: 'auto',
                border: "1px solid #dee2e6",
                fontSize: '1em',
                backgroundColor: "#f9f9f9",
                borderRadius: "8px",
                marginLeft: "0px",
                marginRight: "0px",
                marginBottom: "5px",
                marginTop: "8px"

            }}
        />
        <Button
            onClick={saveContent}
            className='btn btn-sm btn-primary float-end mt-3'>
                <i className="bi bi-cloud-arrow-up"></i> {item ? ' Update': ' Save'}</Button>
        </>
    )
}