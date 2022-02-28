import React                from "react";
import Container            from 'react-bootstrap/Container';
import { LearnSelection }   from "../layout/learnSelection";
import { Navigation }       from "../layout/navigation";
import { WritingModule }    from "../layout/writingModule";
import { useTypes }         from "../../hooks/remind/useTypes";
import { useTopics }        from "../../hooks/remind/useTopics_mql";
import { useRemind }        from "../../hooks/remind/useRemind_mql";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BSON }             from "realm-web";
import { PrintLastItem }    from "../layout/printLastItem";


const reducer = (state, action) => {
    switch(action.type){
        case 'setMode':
            return {...state, mode: action.payload};
        case 'setTitle':
            return {...state, title: action.payload};
        case 'setContent':
            return {...state, content: action.payload};
        case 'setType':
            return {...state, type: action.payload};
        case 'setTopic':
            return {...state, topic: action.payload};
        default:
        return state;
    }
}

export const Learn = (props) => {
    // get types and save type
    const { types, saveType }       = useTypes();
    const { topics, saveTopic }     = useTopics();
    const { reminds, saveRemind}    = useRemind();
    const [lastItem, setLastItem]   = React.useState(null);
    const checked                   = React.useRef(null);

    React.useEffect(() => {
        //console.log(reminds, 'reminds gotten');
        // set last item if any

        if(
            (reminds.length) &&
            (checked.current === null || (!lastItem && Array.isArray(reminds))) && 
            (typeof reminds === 'object') && 
            (JSON.stringify(reminds[0]) !== JSON.stringify(lastItem))
            ){
            setLastItem({...reminds[0]});
            checked.current = true;
        }

    }, [reminds, setLastItem, lastItem, props]);

    const initialState = {
        mode: 'text',
        title: '',
        type: '',
        topic: '',
        content: ''
    }

    const [state, dispatch] = React.useReducer(reducer, initialState);

    const updateOptionSelect = (type, value) => {
        switch(type){
            case 'TYPE':
                dispatch({type: 'setType', payload: value});
                break;
            case 'TOPIC':
                dispatch({type: 'setTopic', payload: value});
                break;
            default:
                return;
        }
    }

    const notify = (msg) => toast.success(msg, {
        position: toast.POSITION.TOP_CENTER
      });

    const showError = (msg) => toast.error(msg, {
        position: toast.POSITION.TOP_CENTER
        });

    const confirmDelete = (deleted = false) => {
        // slide out the last item
        if(deleted){
            setLastItem(null);
        }
    }

    const saveTypes = (type) => {
        return new Promise( async (resolve, reject) => {
            const fd = types.find(t => t.type === type);
            if(type && !fd){
              const saved =  await saveType({type: type});
                // toastify
                if(saved !== false){
                    notify('Successfully saved!');
                }
                if(saved === false){
                    showError('Could not save, please check if that already exists!');
                }
                resolve(saved);
            }
            resolve(false);
        });
    }

    const saveTopics = (topic) => {
        return new Promise( async (resolve, reject) => {
            const fd = topics.find(t => t.topic === topic);
            if(topic && !fd){
              const saved =  await saveTopic({topic: topic});
                // toastify
                // toastify
                if(saved !== false){
                    notify('Successfully saved!');
                }
                if(saved === false){
                    showError('Could not save, please check if that already exists!');
                }
                resolve(saved);
            }
            resolve(false);
        });
    }

    const inputType = (value) => {
        dispatch({type: 'setMode', payload: value});
    }
    const manageTitle = (value) => {
        dispatch({type: 'setTitle', payload: value});
    }

    const manageContent = (content) => {
        dispatch({type: 'setContent', payload: content});
        let valid = true;

        if(!state.mode){
            showError('You must select the editor mode');
            valid = false;
        }

        if(!state.type){
            showError('You must select learning type tag!');
            valid = false;
        }

        if(!state.topic){
            showError('You must select learning topic');
            valid = false;
        }

        if(!state.title){
            showError('You must select the title for the content');
            valid = false;
        }

        if(!content){
            showError('You must have come content to save learning section');
            valid = false; 
        }

        const fc = reminds.find(c => (c.content === content || c.title === state.title));

        if(valid && !fc){
            return new Promise(async (resolve, reject) => {
                try {
                    const ID = BSON.ObjectID;
                    const saveObj = {
                        _id: ID,
                        type: state.type,
                        topic: state.topic,
                        mode: state.mode,
                        title: state.title,
                        content: state.mode === 'code' ? encodeURIComponent(content) : content,
                        date: (new Date()).toISOString()
                    }
                    const saved = saveRemind(saveObj);

                    //console.log(saved);

                    resolve(saved);

                    if(saved !== false){
                        notify('Knowledge Successfully saved!');
                        setLastItem({...saveObj});
                    }

                    if(saved === false){
                        showError('Could not save, please check if that already exists!');
                    }
                    
                } catch (error) {
                    console.log(error.message);
                    resolve(false);
                }
            });
        }

        if(fc){
            showError('Content Already Exists'); 
        }

        console.log(state);
        console.log(content);
    }

    return(
    <Container className="col-11 col-lg-6 mx-auto mb-5">
        <Navigation link={'/'} text={'home'} />
        <LearnSelection 
            upDateSelection={updateOptionSelect} 
            addty={saveTypes} 
            addto={saveTopics} />
        <WritingModule 
            inputType={inputType} 
            manageTitle={manageTitle} 
            manageContent={manageContent}
            />
        {lastItem ? <PrintLastItem object={lastItem} opt={true} notifier={confirmDelete}/>: null}
        <ToastContainer />
    </Container>
    );
}

