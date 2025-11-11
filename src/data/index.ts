import type { IAddTaskForm } from "../interfaces";

export const CardsData: { id: number; title: string; color: string }[] = [
  {
    id: 1,
    title: "backlog",
    color: "primary",
  },
  {
    id: 2,
    title: "In Progress",
    color: "info",
  },
  {
    id: 3,
    title: "Review",
    color: "success",
  },
  {
    id: 4,
    title: "Done",
    color: "danger",
  },
];

export const addTaskForm: IAddTaskForm[] = [
  {
    id: 1,
    type: "text",
    placeholder: "Title",
    name: "title",
  },
  {
    id: 2,
    type: "select",
    name: "column",
  },
  {
    id: 3,
    type: "text",
    name: "description",
    placeholder: "Description",
  },
];
