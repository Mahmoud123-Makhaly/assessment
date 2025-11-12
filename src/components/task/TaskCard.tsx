import { Card, CardHeader, CardBody, Alert } from "reactstrap";
import type { ITask } from "../../interfaces";
import "./TaskCard.css";
import AxiosInstance from "../../config/axios.config";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { FaEdit } from "react-icons/fa";

interface TaskProps {
  tasks: ITask[];
  title: string;
  titleBg: string;
  isDragOver?: boolean;
  setTasks: React.Dispatch<React.SetStateAction<ITask[]>>;
  refetch: () => void;
  isLoading: boolean;
  onEditTask: (taskId: number | undefined) => void;
}

const TaskCard = (props: TaskProps) => {
  const { tasks, title, titleBg, isLoading, onEditTask } = props;

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    taskId: number | undefined
  ) => {
    e.dataTransfer.setData("taskId", String(taskId));
    e.dataTransfer.setData("title", title);
    e.dataTransfer.dropEffect = "move";
    e.dataTransfer.effectAllowed = "move";
  };
  const handleDeleteTask = async (taskId: number | undefined) => {
    await AxiosInstance.delete(`/tasks/${taskId}`);
    props.refetch();
  };

  return (
    <Card className="my-2  task-card">
      <CardHeader
        className={`bg-${titleBg} text-center text-white fw-semibold`}
      >
        {" "}
        {title}
      </CardHeader>
      <CardBody className="position-relative">
        {isLoading ? (
          <div className="d-flex justify-content-center position-absolute start-50 top-50 translate-middle">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : tasks.length > 0 ? (
          tasks?.map((task: ITask, index: number) => (
            <div
              key={task.id}
              className="pointer"
              draggable
              onDragStart={(e) => handleDragStart(e, task.id)}
            >
              <Alert
                color="light"
                className="border border-info shadow pointer d-flex justify-content-between align-items-center"
              >
                <span>
                  {task.title} - # {index + 1}
                </span>
                <div className="d-flex align-items-center gap-2">
                  <FaEdit
                    size={20}
                    onClick={() => onEditTask(task.id)}
                    className="text-primary"
                  />
                  <IoMdCloseCircleOutline
                    size={20}
                    onClick={() => handleDeleteTask(task.id)}
                    className="text-danger"
                  />
                </div>
              </Alert>
            </div>
          ))
        ) : (
          <p className="text-center">No tasks found</p>
        )}
      </CardBody>
    </Card>
  );
};
export default TaskCard;
