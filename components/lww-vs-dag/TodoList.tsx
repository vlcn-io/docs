import React, { useState, useCallback } from "react";
import { CtxAsync as Ctx, useQuery } from "@vlcn.io/react";
import { newIID as newId } from "./id";
import { DBAsync } from "@vlcn.io/xplat-api";
import styles from "./style.module.css";

export type Event = {
  itemId?: bigint;
  type:
    | "add"
    | "remove"
    | "complete"
    | "rename"
    | "completeAll"
    | "uncompleteAll"
    | "clearCompleted";
  value?: any;
};
export type EventHandler = (ctx: Ctx, event: Event) => void;

type Todo = {
  id: bigint;
  text: string;
  completed: boolean;
};

type Filter = "all" | "active" | "completed";
type TodoList = {
  filter: Filter;
  editing: bigint | null;
};

function Header({
  ctx,
  nodeName,
  eventHandler,
}: {
  ctx: Ctx;
  nodeName: string;
  eventHandler: EventHandler;
}) {
  const [newText, setNewText] = React.useState<string>("");
  return (
    <header className={styles.header}>
      <h1>todos - {nodeName}</h1>
      <input
        type="text"
        className={styles["new-todo"]}
        placeholder="What needs to be done?"
        value={newText}
        onChange={(e) => setNewText(e.target.value)}
        onKeyUp={(e) => {
          const target = e.target as HTMLInputElement;
          if (e.key === "Enter" && target.value.trim() !== "") {
            setNewText("");
            return eventHandler(ctx, {
              type: "add",
              itemId: newId(ctx.db.siteid.replaceAll("-", "")),
              value: target.value,
            });
          }
        }}
      />
    </header>
  );
}

const TodoView = ({
  todo,
  editing,
  startEditing,
  saveTodo,
  ctx,
  eventHandler,
}: {
  key?: any;
  todo: Todo;
  editing: boolean;
  startEditing: (t: Todo) => void;
  saveTodo: (todo: Todo, text: string) => void;
  ctx: Ctx;
  eventHandler: EventHandler;
}) => {
  let body;

  const [text, setText] = useState(todo.text);
  const deleteTodo = () => {
    return eventHandler(ctx, { type: "remove", itemId: todo.id });
  };
  const toggleTodo = () => {
    return eventHandler(ctx, {
      type: "complete",
      itemId: todo.id,
      value: todo.completed ? 0 : 1,
    });
  };

  if (editing) {
    body = (
      <input
        type="text"
        className={styles.edit}
        autoFocus
        value={text}
        onBlur={() => saveTodo(todo, text)}
        onKeyUp={(e) => e.key === "Enter" && saveTodo(todo, text)}
        onChange={(e) => setText(e.target.value)}
      />
    );
  } else {
    body = (
      <div className={styles.view}>
        <input
          type="checkbox"
          className={styles.toggle}
          checked={todo.completed}
          onChange={toggleTodo}
        />
        <label
          onDoubleClick={() => {
            setText(todo.text);
            startEditing(todo);
          }}
        >
          {todo.text}
        </label>
        <button className={styles.destroy} onClick={deleteTodo} />
      </div>
    );
  }
  return (
    <li
      className={
        (todo.completed ? styles["completed"] + " " : "") +
        (editing ? styles["editing"] : "")
      }
    >
      {body}
    </li>
  );
};

function Footer({
  remaining,
  todos,
  clearCompleted,
  todoList,
  db,
  setFilter,
}: {
  remaining: number;
  todos: readonly Todo[];
  clearCompleted: () => void;
  todoList: TodoList;
  db: DBAsync;
  setFilter: (f: Filter) => void;
}) {
  let clearCompletedButton;
  if (remaining !== todos.length) {
    clearCompletedButton = (
      <button className={styles["clear-completed"]} onClick={clearCompleted}>
        Clear Done
      </button>
    );
  }

  const updateFilter = (filter: Filter) => {
    setFilter(filter);
  };

  return (
    <footer className={styles.footer}>
      <span className={styles["todo-count"]}>
        <strong> {remaining} </strong>
        {remaining === 1 ? "item" : "items"} left
      </span>
      <ul className={styles.filters}>
        <li>
          <a
            className={todoList.filter === "all" ? styles.selected : ""}
            onClick={() => updateFilter("all")}
          >
            {" "}
            All{" "}
          </a>
        </li>
        <li>
          <a
            className={todoList.filter === "active" ? styles.selected : ""}
            onClick={() => updateFilter("active")}
          >
            Active
          </a>
        </li>
        <li>
          <a
            className={todoList.filter === "completed" ? styles.selected : ""}
            onClick={() => updateFilter("completed")}
          >
            Done
          </a>
        </li>
      </ul>
      {clearCompletedButton}
    </footer>
  );
}

export default function TodoList({
  ctx,
  nodeName,
  eventHandler,
  ex,
}: {
  ctx: Ctx;
  nodeName: string;
  eventHandler: EventHandler;
  ex: string;
}) {
  const db = ctx?.db;
  const [list, setList] = useState<TodoList>({
    editing: null,
    filter: "all",
  });
  const startEditing = useCallback((todo: Todo) => {
    setList((old) => ({
      ...old,
      editing: todo.id,
    }));
  }, []);
  const saveTodo = useCallback(
    (todo: Todo, text: string) => {
      setList((old) => ({
        ...old,
        editing: null,
      }));
      return eventHandler(ctx!, {
        type: "rename",
        itemId: todo.id,
        value: text,
      });
    },
    [ctx, eventHandler]
  );

  // if db is null, spinner to indicate loading
  // if (db == null || ctx == null) {
  //   // do some better fb like newsfeed loading indicators
  //   return <div>loading...</div>;
  // }

  const clearCompleted = () => {
    return eventHandler(ctx, { type: "clearCompleted" });
  };

  const toggleAll = () => {
    if (remaining === 0) {
      // uncomplete all
      return eventHandler(ctx, { type: "uncompleteAll" });
    } else {
      // complete all
      return eventHandler(ctx, { type: "completeAll" });
    }
  };
  let toggleAllCheck;

  const allTodos: readonly Todo[] = useQuery<Todo>(
    ctx,
    "SELECT * FROM todo ORDER BY id DESC"
  ).data;
  const completeTodos = allTodos.filter((t) => t.completed);
  const activeTodos = allTodos.filter((t) => !t.completed);

  const remaining = activeTodos.length;
  let todos =
    list.filter === "active"
      ? activeTodos
      : list.filter === "completed"
      ? completeTodos
      : allTodos;

  if (allTodos.length) {
    toggleAllCheck = (
      <>
        <input
          id={"toggle-all-" + nodeName + ex}
          type="checkbox"
          className={styles["toggle-all"]}
          checked={remaining === 0}
          onChange={toggleAll}
        />
        <label htmlFor={"toggle-all-" + nodeName + ex}>
          Mark all as complete
        </label>
      </>
    );
  }

  return (
    <>
      <Header ctx={ctx} nodeName={nodeName} eventHandler={eventHandler} />
      <section
        className={styles.main}
        style={allTodos.length > 0 ? {} : { display: "none" }}
      >
        {toggleAllCheck}
        <ul className={styles["todo-list"]}>
          {todos.map((t) => (
            <TodoView
              ctx={ctx}
              eventHandler={eventHandler}
              key={t.id.toString()}
              todo={t}
              editing={list.editing === t.id}
              startEditing={startEditing}
              saveTodo={saveTodo}
            />
          ))}
        </ul>
        <Footer
          db={db}
          remaining={remaining}
          todos={allTodos}
          todoList={list}
          clearCompleted={clearCompleted}
          setFilter={(f: Filter) => {
            setList((l) => ({
              ...l,
              filter: f,
            }));
          }}
        />
      </section>
    </>
  );
}
