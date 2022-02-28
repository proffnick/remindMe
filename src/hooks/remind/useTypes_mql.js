import React from "react";
import { useWatch } from "../useWatch";
import { useCollection } from "./useCollection";
import { useRealmApp } from "../../components/RealmApp";
import { dataSourceName } from "../../realm.json";
import {
  addValueAtIndex,
  replaceValueAtIndex,
  updateValueAtIndex,
  removeValueAtIndex,
  getTypeIndex,
} from "../../utils"; 

export function useTypes() {
  // Set up a list of todos in state
  const realmApp = useRealmApp();
  const [types, setTypes] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  // Get a client object for the todo task collection
  const typesCollection = useCollection({
    cluster: dataSourceName,
    db: "remind",
    collection: "types",
  });

  // Fetch all todos on load and whenever our collection changes (e.g. if the current user changes)
  React.useEffect(() => {
    typesCollection.find({}).then((fetchedTypes) => {
      setTypes(fetchedTypes);
      setLoading(false);
    });
  }, [typesCollection]);

  // Use a MongoDB change stream to reactively update state when operations succeed
  useWatch(typesCollection, {
    onInsert: (change) => {
      setTypes((oldTypes) => {
        if (loading) {
          return oldTypes;
        }
        const idx =
        getTypeIndex(oldTypes, change.fullDocument) ?? oldTypes.length;
        if (idx === oldTypes.length) {
          return addValueAtIndex(oldTypes, idx, change.fullDocument);
        } else {
          return oldTypes;
        }
      });
    },
    onUpdate: (change) => {
      setTypes((oldTypes) => {
        if (loading) {
          return oldTypes;
        }
        const idx = getTypeIndex(oldTypes, change.fullDocument);
        return updateValueAtIndex(oldTypes, idx, () => {
          return change.fullDocument;
        });
      });
    },
    onReplace: (change) => {
      setTypes((oldTypes) => {
        if (loading) {
          return oldTypes;
        }
        const idx = getTypeIndex(oldTypes, change.fullDocument);
        return replaceValueAtIndex(oldTypes, idx, change.fullDocument);
      });
    },
    onDelete: (change) => {
      setTypes((oldTypes) => {
        if (loading) {
          return oldTypes;
        }
        const idx = getTypeIndex(oldTypes, { _id: change.documentKey._id });
        if (idx >= 0) {
          return removeValueAtIndex(oldTypes, idx);
        } else {
          return oldTypes;
        }
      });
    },
  });

  // Given a draft todo, format it and then insert it
  const saveType = async (draftType) => {
    if (draftType.type) {
      draftType._partition = realmApp.currentUser.id;
      console.log('We are about to save data');
      try {
       return await typesCollection.insertOne(draftType);
      } catch (err) {
        if (err.error.match(/^Duplicate key error/)) {
          console.warn(
            `Saving topic error: ${err.error}`
          );
        }
        console.error(err);
      }
    }
  };
  
  // Given a draft todo, format it and then insert it
  const updateType = async (draftType, _id) => {
    if (draftType.type) {
      draftType._partition = realmApp.currentUser.id;
      try {
        return await typesCollection.updateOne({_id: _id}, {$set: {...draftType } });
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
  const deleteType = async (type) => {
    await typesCollection.deleteOne({ _id: type._id });
  };

  return {
    loading,
    types,
    saveType,
    updateType,
    deleteType
  };
}
