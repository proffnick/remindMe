import React from "react";
import { useWatch } from "../useWatch";
import { useCollection } from "./useCollection";
import { useRealmApp } from "../../components/RealmApp";
import { dataSourceName } from "../../realm.json";
import { BSON } from 'realm-web';
import {
  addValueAtIndex,
  replaceValueAtIndex,
  updateValueAtIndex,
  removeValueAtIndex,
  getRemindIndex,
} from "../../utils"; 

export function useRemind() {
  // Set up a list of todos in state
  const realmApp = useRealmApp();
  const [reminds, setReminds] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  // Get a client object for the todo task collection
  const knowledgeCollection = useCollection({
    cluster: dataSourceName,
    db: "remind",
    collection: "knowledge",
  });

  // Fetch all todos on load and whenever our collection changes (e.g. if the current user changes)
  // get current settings as well if any or return result based on the last login
  React.useEffect(() => {
    knowledgeCollection.find({_partition: realmApp.currentUser.id}, {sort: {_id: -1}, limit: 10}).then((fetchedReminds) => {
      setReminds(fetchedReminds);
      setLoading(false);
    });
  }, [knowledgeCollection, realmApp]);

  // Use a MongoDB change stream to reactively update state when operations succeed
  useWatch(knowledgeCollection, {
    onInsert: (change) => {
      setReminds((oldReminds) => {
        if (loading) {
          return oldReminds;
        }
        const idx =
        getRemindIndex(oldReminds, change.fullDocument) ?? oldReminds.length;
        if (idx === oldReminds.length) {
          return addValueAtIndex(oldReminds, idx, change.fullDocument);
        } else {
          return oldReminds;
        }
      });
    },
    onUpdate: (change) => {
      setReminds((oldReminds) => {
        if (loading) {
          return oldReminds;
        }
        const idx = getRemindIndex(oldReminds, change.fullDocument);
        return updateValueAtIndex(oldReminds, idx, () => {
          return change.fullDocument;
        });
      });
    },
    onReplace: (change) => {
      setReminds((oldReminds) => {
        if (loading) {
          return oldReminds;
        }
        const idx = getRemindIndex(oldReminds, change.fullDocument);
        return replaceValueAtIndex(oldReminds, idx, change.fullDocument);
      });
    },
    onDelete: (change) => {
      setReminds((oldReminds) => {
        if (loading) {
          return oldReminds;
        }
        const idx = getRemindIndex(oldReminds, { _id: change.documentKey._id });
        if (idx >= 0) {
          return removeValueAtIndex(oldReminds, idx);
        } else {
          return oldReminds;
        }
      });
    },
  });

  // Given a draft todo, format it and then insert it
  const saveRemind = async (draftRemind) => {
    if (draftRemind.content) {
      draftRemind._partition = realmApp.currentUser.id;
      try {
        return await knowledgeCollection.insertOne(draftRemind);
      } catch (err) {
        if (err.error.match(/^Duplicate key error/)) {
          console.warn(
            `The following error means that we tried to insert a remind multiple times (i.e. an existing remind has the same _id). In this app we just catch the error and move on. In your app, you might want to debounce the save input or implement an additional loading state to avoid sending the request in the first place.`
          );
        }
        console.error(err);
      }
    }
  };

    // Given a draft todo, format it and then insert it
    const findRemind = async (id) => {
      try {
        return await knowledgeCollection.findOne({_id: new BSON.ObjectId(id)});
      } catch (err) {
        if (err.message.match(/^Duplicate key error/)) {
          console.warn(
            `The following error means that we tried to insert a remind multiple times (i.e. an existing remind has the same _id). In this app we just catch the error and move on. In your app, you might want to debounce the save input or implement an additional loading state to avoid sending the request in the first place.`
          );
        }
        console.error(err);
        return null;
      }
    };


    const findAllRemind = async (query = {}) => {

      // object structure
      // object structure is bount to contain
      // 
      /*
      {
        $and: [
          {topic: ''},
          {type: ''},
          {content: ''}
        ],
        sort: {_id: -1}
      }
      */

      if(Object.keys(query).length){
        const topic   = new RegExp(`\\b.*${query.topic}.*\\b`,);
        const type    = query.type !== 'all' ? new RegExp(`\\b.*${query.type}.*\\b`): new RegExp(`\\b.*\\b`);
        const title   = query.query ? new RegExp(`\\b.*${query.query}.*\\b`): new RegExp(`\\b.*\\b`);
        const content = query.query ? new RegExp(`\\b.*${query.query}.*\\b`): new RegExp(`\\b.*\\b`);
  
        let part = {};
  
        if(query.type !== "all" && query.topic){
          part = {topic: topic, $and: [
            {type: type},
            {$or: [
              {title: title},
              {content: content}
            ]}
          ]}
        }
  
        if(query.type === 'all' && query.topic){
          part = {topic: topic, $and: [
            {$or:[
              {type: type},
              {title: title},
              {content: content}
            ] 
            }
          ]}
        }
  
        if(query.type === 'all' && !query.topic){
          part = {type: type, $or: [
              {title: title},
              {content: content}
          ]}
        }
  
        try {
  
          return await knowledgeCollection.find(part, {sort: {_id: -1}, limit: query.limit, skip: query.skip});
  
        } catch (err) {
          if (err.message.match(/^Duplicate key error/)) {
  
            console.warn(
              `We tried to find but could not find anything meaningful and an error occured`
            );
            return [];
          }
        }
      }
     
    };
  // Given a draft todo, format it and then insert it
  const updateRemind = async (draftRemind, _id) => {
    if (draftRemind.content) {
      draftRemind._partition = realmApp.currentUser.id;
      try {
        await knowledgeCollection.updateOne({_id: _id}, {$set: {...draftRemind } });
      } catch (err) {
        if (err.error.match(/^Duplicate key error/)) {
          console.warn(
            `Error updating knowledge: ${err.error}`
          );
        }
        console.error(err);
      }
    }
  };
  // Delete a given todo
  const deleteRemind = async (remind) => {
    await knowledgeCollection.deleteOne({ _id: remind._id });
  };

  return {
    loading,
    reminds,
    saveRemind,
    updateRemind,
    findRemind,
    findAllRemind,
    deleteRemind
  };
}
