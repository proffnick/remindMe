export const toggleBoolean = (prev) => !prev;

const isValidArrayIndex = (arr, idx) => {
  return !(idx < 0 || idx >= arr.length);
};

export function addValueAtIndex(arr, idx, value) {
  if (!isValidArrayIndex(arr, idx) && idx !== arr.length) {
    throw new Error(`Cannot add value. Array index out of bounds.`);
  }
  return [...arr.slice(0, idx), value, ...arr.slice(idx)];
}

export function replaceValueAtIndex(arr, idx, newValue) {
  if (!isValidArrayIndex(arr, idx)) {
    throw new Error(`Cannot replace value. Array index out of bounds.`);
  }
  return [...arr.slice(0, idx), newValue, ...arr.slice(idx + 1)];
}

export function updateValueAtIndex(arr, idx, updater) {
  if (!isValidArrayIndex(arr, idx)) {
    throw new Error(`Cannot update value. Array index out of bounds.`);
  }
  return [...arr.slice(0, idx), updater(arr[idx]), ...arr.slice(idx + 1)];
}

export function removeValueAtIndex(arr, idx) {
  if (!isValidArrayIndex(arr, idx)) {
    throw new Error(`Cannot remove value. Array index out of bounds.`);
  }
  return [...arr.slice(0, idx), ...arr.slice(idx + 1)];
}

export const isSameTodo = (todo1, todo2) =>
  String(todo1?._id) === String(todo2?._id);

export const getTodoIndex = (todos, todo) => {
  const idx = todos.findIndex((t) => isSameTodo(t, todo));
  return idx >= 0 ? idx : null;
};

export const isSameReminder = (remind1, remind2) =>
  String(remind1?._id) === String(remind2?._id);

export const getRemindIndex = (reminds, remind) => {
  const idx = reminds.findIndex((t) => isSameReminder(t, remind));
  return idx >= 0 ? idx : null;
};

export const isSameTopic = (topic1, topic2) =>
  String(topic1?._id) === String(topic2?._id);

export const getTopicIndex = (topics, topic) => {
  const idx = topics.findIndex((t) => isSameTopic(t, topic));
  return idx >= 0 ? idx : null;
};

export const isKnowledgeType = (type1, type2) =>
  String(type1?._id) === String(type2?._id);

export const getTypeIndex = (types, type) => {
  const idx = types.findIndex((t) => isKnowledgeType(t, type));
  return idx >= 0 ? idx : null;
};

export const animateCSS = (element, animation, prefix = 'animate__') => {
// We create a Promise and return it
  return new Promise((resolve, reject) => {
    const animationName = `${prefix}${animation}`;
    const node = document.querySelector(element);

    if(null !== node){
      node.classList.add(`${prefix}animated`, animationName);

      // When the animation ends, we clean the classes and resolve the Promise
      function handleAnimationEnd(event) {
        event.stopPropagation();
        node.classList.remove(`${prefix}animated`, animationName);
        resolve('Animation ended');
      }

      node.addEventListener('animationend', handleAnimationEnd, {once: true});
    }
  });
}

export const addAndRemoveClass = (element, cl) => {
  element.classList.add(cl);
  setTimeout(() => {
    element.classList.remove(cl);
  }, 1000);
}
