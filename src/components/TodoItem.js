import React from "react";
import {
  Checkbox,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
} from "@material-ui/core";
import ClearIcon from "@material-ui/icons/Clear";
import Card from 'react-bootstrap/Card'

export function TodoItem({ todo, todoActions }) {
  return (
    <Card className="bg-light rounded-3 border-0 shadow-sm mb-2">
      <ListItem>
        <ListItemIcon>
          <Checkbox
            edge="start"
            color="primary"
            checked={todo.isComplete}
            onClick={() => {
              todoActions.toggleTodo(todo);
            }}
          />
        </ListItemIcon>
        <ListItemText>{todo.summary}</ListItemText>
        <ListItemSecondaryAction>
          <IconButton
            edge="end"
            size="small"
            onClick={() => {
              todoActions.deleteTodo(todo);
            }}
          >
            <ClearIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    </Card>
  );
}
