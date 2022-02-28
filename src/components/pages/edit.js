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
import { useParams }        from 'react-router-dom';


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

export const Edit = (props) => {
    // get types and save type
    const { types, saveType }       = useTypes();
    const { topics, saveTopic }     = useTopics();
    const { reminds, findRemind, updateRemind}    = useRemind();
    const { id }                    = useParams();
    const [currentId, setCurrentItem] = React.useState(null);


    const findCurrentKonwledge = React.useCallback(async () => {

        const found = await findRemind(id);

        if(found && JSON.stringify(found) !== JSON.stringify(currentId)){
            setCurrentItem({...found});
        }

    }, [id, currentId, setCurrentItem, findRemind]);

    React.useEffect(() => {
        findCurrentKonwledge();

    }, [reminds, props, currentId, findCurrentKonwledge]);




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

    const manageContent = (content, withItem = false) => {
        dispatch({type: 'setContent', payload: content});
        let valid = true;

        if(!state.mode && !withItem){
            showError('You must select the editor mode');
            valid = false;
        }

        if(!state.type && !withItem){
            showError('You must select learning type tag!');
            valid = false;
        }

        if(!state.topic && !withItem){
            showError('You must select learning topic');
            valid = false;
        }

        if(!state.title && !withItem){
            showError('You must select the title for the content');
            valid = false;
        }

        if(!content && !withItem){
            showError('You must have come content to save learning section');
            valid = false; 
        }

        //console.log(state, content);

        if(valid && currentId && !withItem){
            return new Promise(async (resolve, reject) => {
                try {
                    const ID = new BSON.ObjectID(currentId._id);
                    const saveObj = {
                        type: state.type,
                        topic: state.topic,
                        mode: state.mode,
                        title: state.title,
                        content: state.mode === 'code' ? encodeURIComponent(content) : content,
                    }
                    const saved = await updateRemind(saveObj, ID);

                    //console.log(saved);

                    resolve(saved);

                    if(saved !== false){
                        notify('Knowledge Successfully updated!');
                        //setLastItem({...saveObj});
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
    }

    return(
    <Container className="col-11 col-lg-6 mx-auto mb-5">
        <Navigation link={'/'} text={'home'} />
        <LearnSelection 
            upDateSelection={updateOptionSelect} 
            addty={saveTypes} 
            addto={saveTopics}
            item={currentId}
             />
        <WritingModule 
            inputType={inputType} 
            manageTitle={manageTitle} 
            manageContent={manageContent}
            item={currentId}
            />
        <ToastContainer />
    </Container>
    );
}

