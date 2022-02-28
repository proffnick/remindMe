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
  getTopicIndex,
} from "../../utils"; 

export function useTopics() {
  // Set up a list of todos in state
  const realmApp = useRealmApp();
  const [topics, setTopics] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  // Get a client object for the todo task collection
  const topicsCollection = useCollection({
    cluster: dataSourceName,
    db: "remind",
    collection: "topics",
  });

  // Fetch all todos on load and whenever our collection changes (e.g. if the current user changes)
  React.useEffect(() => {
    topicsCollection.find({}).then((fetchedTopics) => {
      setTopics(fetchedTopics);
      setLoading(false);
    });
  }, [topicsCollection]);

  // Use a MongoDB change stream to reactively update state when operations succeed
  useWatch(topicsCollection, {
    onInsert: (change) => {
      setTopics((oldTopics) => {
        if (loading) {
          return oldTopics;
        }
        const idx =
        getTopicIndex(oldTopics, change.fullDocument) ?? oldTopics.length;
        if (idx === oldTopics.length) {
          return addValueAtIndex(oldTopics, idx, change.fullDocument);
        } else {
          return oldTopics;
        }
      });
    },
    onUpdate: (change) => {
      setTopics((oldTopics) => {
        if (loading) {
          return oldTopics;
        }
        const idx = getTopicIndex(oldTopics, change.fullDocument);
        return updateValueAtIndex(oldTopics, idx, () => {
          return change.fullDocument;
        });
      });
    },
    onReplace: (change) => {
      setTopics((oldTopics) => {
        if (loading) {
          return oldTopics;
        }
        const idx = getTopicIndex(oldTopics, change.fullDocument);
        return replaceValueAtIndex(oldTopics, idx, change.fullDocument);
      });
    },
    onDelete: (change) => {
      setTopics((oldTopics) => {
        if (loading) {
          return oldTopics;
        }
        const idx = getTopicIndex(oldTopics, { _id: change.documentKey._id });
        if (idx >= 0) {
          return removeValueAtIndex(oldTopics, idx);
        } else {
          return oldTopics;
        }
      });
    },
  });

  // Given a draft todo, format it and then insert it
  const saveTopic = async (draftTopic) => {
    if (draftTopic.topic) {
      draftTopic._partition = realmApp.currentUser.id;
      try {
        return await topicsCollection.insertOne(draftTopic);
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
  const updateTopic = async (draftTopic, _id) => {
    if (draftTopic.topic) {
      draftTopic._partition = realmApp.currentUser.id;
      try {
        return await topicsCollection.updateOne({_id: _id}, {$set: {...draftTopic } });
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
  const deleteTopic = async (remind) => {
    await topicsCollection.deleteOne({ _id: remind._id });
  };

  return {
    loading,
    topics,
    saveTopic,
    updateTopic,
    deleteTopic
  };
}
