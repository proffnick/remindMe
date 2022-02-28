import React from "react";
import { ApolloClient, gql, HttpLink, InMemoryCache } from "@apollo/client";
import jwt_decode from "jwt-decode";
import { useWatch } from "../useWatch";
import { useCollection } from "./useCollection";
import { useRealmApp } from "../../components/RealmApp";
import { baseUrl, dataSourceName } from "../../realm.json";
import {
  addValueAtIndex,
  replaceValueAtIndex,
  updateValueAtIndex,
  removeValueAtIndex,
  getRemindIndex,
} from "../../utils";

function useApolloClient() {
  const realmApp = useRealmApp();
  if (!realmApp.currentUser) {
    throw new Error(`You must be logged in to Realm to call useApolloClient()`);
  }

  const client = React.useMemo(() => {
    const graphqlUri = `${baseUrl}/api/client/v2.0/app/${realmApp.id}/graphql`;
    // Local apps should use a local URI!
    // const graphqlUri = `https://us-east-1.aws.stitch.mongodb.com/api/client/v2.0/app/${realmApp.id}/graphql`

    async function getValidAccessToken() {
      // An already logged in user's access token might be expired. We decode the token and check its
      // expiration to find out whether or not their current access token is stale.
      const { exp } = jwt_decode(realmApp.currentUser.accessToken);
      const isExpired = Date.now() >= exp * 1000;
      if (isExpired) {
        // To manually refresh the user's expired access token, we refresh their custom data
        await realmApp.currentUser.refreshCustomData();
      }
      // The user's access token is now guaranteed to be valid (unless their account is disabled or deleted)
      return realmApp.currentUser.accessToken;
    }

    return new ApolloClient({
      link: new HttpLink({
        uri: graphqlUri,
        // We define a custom fetch handler for the Apollo client that lets us authenticate GraphQL requests.
        // The function intercepts every Apollo HTTP request and adds an Authorization header with a valid
        // access token before sending the request.
        fetch: async (uri, options) => {
          const accessToken = await getValidAccessToken();
          options.headers.Authorization = `Bearer ${accessToken}`;
          return fetch(uri, options);
        },
      }),
      cache: new InMemoryCache(),
    });
  }, [realmApp.currentUser, realmApp.id]);

  return client;
}

export function useRemind() {
  // Get a graphql client and set up a list of todos in state
  const realmApp = useRealmApp();
  const graphql = useApolloClient();
  const [reminds, setReminds] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  // Fetch all todos on load and whenever our graphql client changes (i.e. either the current user OR App ID changes)
  React.useEffect(() => {
    const query = gql`
      query FetchAllReminds {
        knowledge {
          _id
          _partition
          type
          topic
          mode
          title
          content
          date
        }
      }
    `;
    graphql.query({ query }).then(({ data }) => {
      setReminds(data.tasks);
      setLoading(false);
    });
  }, [graphql]);

  // Use a MongoDB change stream to reactively update state when operations succeed
  const taskCollection = useCollection({
    cluster: dataSourceName,
    db: "remind",
    collection: "knowledge",
  });
  useWatch(taskCollection, {
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

  // Given a draft todo, format it and then insert it with a mutation
  const saveRemind = async (draftRemind) => {
    if (draftRemind.content) {
      draftRemind._partition = realmApp.currentUser.id;
      try {
        await graphql.mutate({
          mutation: gql`
            mutation SaveKnowledge($todo: KnowledgeInsertInput!) {
              insertOneKnowledge(data: $todo) {
                _id
                _partition
                type
                topic
                mode
                title
                content
                date
              }
            }
          `,
          variables: { remind: draftRemind },
        });
      } catch (err) {
        if (err.message.match(/^Duplicate key error/)) {
          console.warn(
            `The following error means that we tried to insert a reminder multiple times (i.e. an existing reminder has the same _id). In this app we just catch the error and move on. In your app, you might want to debounce the save input or implement an additional loading state to avoid sending the request in the first place.`
          );
        }
        console.error(err);
      }
    }
  };

  // Delete a given todo
  const deleteRemind = async (remind) => {
    await graphql.mutate({
      mutation: gql`
        mutation DeleteKnowledge($knowledgeId: ObjectId!) {
          deleteOneKnowledge(query: { _id: $knowledgeId }) {
            _id
          }
        }
      `,
      variables: { knowledgeId: remind._id },
    });
  };

  return {
    loading,
    reminds,
    saveRemind,
    deleteRemind,
  };
}
