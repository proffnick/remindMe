import React from "react";
import {
  Container,
  List,
  LinearProgress,
} from "@material-ui/core";
import { useTodos } from "../hooks/todos/useTodos";
import { TodoItem } from "./TodoItem";
import { useDraftTodos } from "../hooks/todos/useDraftTodos";
import { DraftTodoItem } from "./DraftTodoItem";
import { useShowLoader } from "../hooks/util-hooks";
import Button from 'react-bootstrap/Button';


export function TodoItemsPage() {
  const { loading, todos, ...todoActions } = useTodos();
  const { draftTodos, ...draftTodoActions } = useDraftTodos();
  const showLoader = useShowLoader(loading, 200);
  return (
    <Container className="main-container" maxWidth="sm">
      {loading ? (
        showLoader ? (
          <LinearProgress />
        ) : null
      ) : (
        <div className="todo-items-container">
          <p className="text-muted fw-bolder">
            {`You have ${todos.length} To-Do Item${
              todos.length === 1 ? "" : "s"
            }`}
          </p>
          <Button
            variant="primary"
            className="btn-sm"
            onClick={() => draftTodoActions.createDraftTodo()}
          >
            <i className="bi bi-node-plus"></i> Add To-Do
          </Button>
          <List style={{ width: "100%" }}>
            {todos.map((todo) => (
              <TodoItem
                key={String(todo._id)}
                todo={todo}
                todoActions={todoActions}
              />
            ))}
            {draftTodos.map((draft) => (
              <DraftTodoItem
                key={String(draft._id)}
                todo={draft}
                todoActions={todoActions}
                draftTodoActions={draftTodoActions}
              />
            ))}
          </List>
        </div>
      )}
    </Container>
  );
}
