export interface ITask {
  id?: number;
  title: string;
  description: string;
  column: string;
}
export interface IAddTaskForm {
  id: number;
  type: "select" | "text";
  placeholder?: string;
  name: "title" | "description" | "column";
}
