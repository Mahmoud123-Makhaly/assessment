import { Card, CardHeader, CardBody, Alert } from "reactstrap";
import type { ITask } from "../../interfaces";
import "./TaskCard.css";
import AxiosInstance from "../../config/axios.config";
import { IoMdCloseCircleOutline } from "react-icons/io";
interface TaskProps {
  tasks: ITask[];
  title: string;
  titleBg: string;
  isDragOver?: boolean;
  setTasks: React.Dispatch<React.SetStateAction<ITask[]>>;
  refetch: () => void;
  isLoading: boolean;
}

const TaskCard = (props: TaskProps) => {
  const { tasks, title, titleBg, isLoading } = props;

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    taskId: number | undefined
  ) => {
    e.dataTransfer.setData("taskId", String(taskId));
    e.dataTransfer.setData("title", title);
  };
  const handleDeleteTask = async (taskId: number | undefined) => {
    await AxiosInstance.delete(`/tasks/${String(taskId)}`);
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
          tasks?.map((task: ITask) => (
            <div
              key={task.id}
              className="pointer"
              draggable
              onDragStart={(e) => handleDragStart(e, task.id)}
            >
              <Alert color="border border-info shadow pointer d-flex justify-content-between align-items-center">
                {task.title} - # {task.id}
                <IoMdCloseCircleOutline
                  onClick={() => handleDeleteTask(task.id)}
                />
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
