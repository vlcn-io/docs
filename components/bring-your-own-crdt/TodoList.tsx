import React, { useState, useCallback } from "react";
import { CtxAsync as Ctx, useQuery } from "@vlcn.io/react";
import { IID_of, newIID as newId } from "./id";
import { DBAsync, firstPick } from "@vlcn.io/xplat-api";
import styles from "./style.module.css";

export type Mutation =
  | {
      name: "add";
      args: [IID_of<Todo>, string];
    }
  | { name: "remove"; args: [IID_of<Todo>] }
  | { name: "complete"; args: [IID_of<Todo>, number] }
  | { name: "rename"; args: [IID_of<Todo>, string] }
  | { name: "completeAll"; args: [] }
  | { name: "uncompleteAll"; args: [] }
  | { name: "clearCompleted"; args: [] }
  | { name: "increment"; args: [] };

export type EventHandler = (ctx: Ctx, event: Mutation) => void;

export type Todo = {
  id: IID_of<Todo>;
  content: string;
  completed: boolean;
};

type Filter = "all" | "active" | "completed";
type TodoList = {
  filter: Filter;
  editing: IID_of<Todo> | null;
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
              name: "add",
              args: [newId(ctx.db.siteid.replaceAll("-", "")), target.value],
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

  const [text, setText] = useState(todo.content);
  const deleteTodo = () => {
    return eventHandler(ctx, { name: "remove", args: [todo.id] });
  };
  const toggleTodo = () => {
    return eventHandler(ctx, {
      name: "complete",
      args: [todo.id, todo.completed ? 0 : 1],
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
            setText(todo.content);
            startEditing(todo);
          }}
        >
          {todo.content}
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
        name: "rename",
        args: [todo.id, text],
      });
    },
    [ctx]
  );

  // if db is null, spinner to indicate loading
  // if (db == null || ctx == null) {
  //   // do some better fb like newsfeed loading indicators
  //   return <div>loading...</div>;
  // }

  const clearCompleted = () => {
    return eventHandler(ctx, { name: "clearCompleted", args: [] });
  };

  const toggleAll = () => {
    if (remaining === 0) {
      // uncomplete all
      return eventHandler(ctx, { name: "uncompleteAll", args: [] });
    } else {
      // complete all
      return eventHandler(ctx, { name: "completeAll", args: [] });
    }
  };
  let toggleAllCheck;

  const allTodos: readonly Todo[] = useQuery<Todo>(
    ctx,
    "SELECT * FROM todo ORDER BY id DESC"
  ).data;
  const counter =
    useQuery<{ count: number }, number | undefined>(
      ctx,
      "SELECT count FROM counter",
      undefined,
      firstPick
    ).data || 0;
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
      <div
        style={{
          padding: "10px",
          paddingTop: "40px",
          width: "100%",
          background: "#fffff8",
          fontSize: "20px",
          textAlign: "center",
        }}
      >
        <button
          style={{
            cursor: "pointer",
            border: "1px solid black",
            borderRadius: "5px",
            padding: "5px",
            background: "#fff888",
          }}
          onClick={() =>
            eventHandler(ctx, {
              name: "increment",
              args: [],
            })
          }
          // style this like a normal button
        >
          I'm a distributed counter! {counter}
        </button>
      </div>
    </>
  );
}
