import React from "react";
import {
  TextField,
  IconButton,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  withStyles,
} from "@material-ui/core";
import ClearIcon from "@material-ui/icons/Clear";
import Button from 'react-bootstrap/Button';

const ListItemWithTwoSecondaryActions = withStyles({
  secondaryAction: {
    paddingRight: "120px",
  },
})(ListItem);


export function DraftTodoItem({ todo, todoActions, draftTodoActions }) {
  return (
    <ListItemWithTwoSecondaryActions>
      <ListItemText inset>
        <TextField
          style={{ width: "100%" }}
          placeholder="What needs doing?"
          size="small"
          value={todo.summary}
          onChange={(e) => {
            draftTodoActions.setDraftTodoSummary(todo, e.target.value);
          }}
        />
      </ListItemText>
      <ListItemSecondaryAction>
        <Button
          variant="outline-primary"
          className="btn btn-sm"
          onClick={async () => {
            await todoActions.saveTodo(todo);
            draftTodoActions.deleteDraftTodo(todo);
          }}
        >
          <i className="bi bi-cloud-arrow-up"></i> Save
        </Button>
        <IconButton
          edge="end"
          size="small"
          onClick={() => {
            draftTodoActions.deleteDraftTodo(todo);
          }}
        >
          <ClearIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItemWithTwoSecondaryActions>
  );
}
