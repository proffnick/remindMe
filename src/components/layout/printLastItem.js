import React from 'react';
import Card from 'react-bootstrap/Card';
import { useRemind } from '../../hooks/remind/useRemind_mql';
import { toast } from 'react-toastify';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

export const PrintLastItem = ({ object, opt, notifier }) => {
    const { deleteRemind }  = useRemind();
    let navigate            = useNavigate();


    const notify = (text) => toast.success(text, { position: toast.POSITION.TOP_CENTER});


    return(
        <Card className='border-0 rounded-3 mt-4 clearfix w-100 mt-5 border-start border-3 border-primary p-3 animate__animated animate__zoomIn'>
            <Card.Header className='h5 bg-white p-3 text-muted py-1 border-0'>
                {object.title} 
                {!opt ? <button className='btn float-end btn-sm btn-outline-primary border-0' onClick={(e) => {
                   navigate(`/edit/${object._id}`);
                }}><i className="bi bi-pencil-square"></i> Edit</button>: ''}
            </Card.Header>
            <Card.Body className='py-1'  style={{ maxHeight: 300, overflowY: 'auto', overflowX: 'hidden'}}>
                {
                object.mode === 'code'?
                <pre className='bg-light font-monospace p-4 border-start border-success border-4 rounded-3' >
                    <code>
                        {decodeURIComponent(object.content)}
                    </code>
                </pre> :
                object.mode === 'link' ?
                <pre className='p-3 font-monospace '>
                    <code>
                       <mark>{object.content}</mark> 
                    </code>
                </pre> :
                <pre className='p-3'>
                <code dangerouslySetInnerHTML={{__html: object.content}}>
                </code>
                </pre>
                }
            </Card.Body>
            <Card.Footer className='bg-transparent border-0 py-0 my-0'>
                <div className='d-flex justify-content-between'>
                    <div className='align-self-start'>
                        <small className='alert-secondary text-white me-1 rounded-pill p-1 text-muted'>Type: {object.type}</small>
                        <small className='alert-secondary text-white rounded-pill p-1 text-muted'>Topic: {object.topic}</small>
                    </div>
                    <div className='align-self-end text-end'>
                        {opt ? 
                        <button onClick={async () => {
                            await deleteRemind(object);
                            notify('Successfully deleted!');
                            // deleted
                            notifier(true);
                        }} className='btn btn-sm btn-outline-danger rounded-pill'><i className="bi bi-trash"></i> Delete </button>
                        : <small className='fw-lighter fs-6 fst-italic' style={{color: "#b9b9b9"}}>{moment(object.date).format('Do-MMM-YYYY HH:mm:ss A')}</small>}
                    </div>
                </div>
            </Card.Footer>
        </Card>
    );
}