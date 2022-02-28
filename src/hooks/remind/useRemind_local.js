import React from "react";
import { BSON } from "realm-web";
import { useRealmApp } from "../../components/RealmApp";
import {
  addValueAtIndex,
  removeValueAtIndex,
} from "../../utils";

const createExampleReminds = (userId = "60810749247a41a9809fba46") => [
  {
    _id: new BSON.ObjectID(),
    _partition: userId,
    type: "code",
    topic: "Redux",
    mode: "code",
    title: "The redux reducer function",
    content: "const one = 3;",
    date: (new Date).toISOString()
  },
  {
    _id: new BSON.ObjectID(),
    _partition: userId,
    type: "code",
    topic: "useMemo",
    mode: "code",
    title: "The React memo hook",
    content: "const func = React.useMemo(() => (), [])",
    date: (new Date).toISOString()
  },
];

function latency(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function useRemind() {
  const realmApp = useRealmApp();
  const [reminds, setReminds] = React.useState([]);

  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    const fetchReminds = async () => {
      await latency(1640);
      return createExampleReminds(realmApp.currentUser.id);
    };
    fetchReminds().then((t) => {
      setReminds(t);
      setLoading(false);
    });
  }, [realmApp.currentUser.id]);

  const getRemindIndex = (reminds, remind) =>
    reminds.findIndex((t) => String(t._id) === String(remind._id));
  const saveRemind = async (draftRemind) => {
    if (draftRemind.content) {
      setReminds((oldReminds) => {
        const idx = oldReminds.length;
        return addValueAtIndex(oldReminds, idx, draftRemind);
      });
    }
  };
  const deleteRemind = async (remind) => {
    setReminds((oldReminds) => {
      const idx = getRemindIndex(oldReminds, remind);
      return removeValueAtIndex(oldReminds, idx);
    });
  };

  return {
    loading,
    reminds,
    saveRemind,
    deleteRemind,
  };
}
