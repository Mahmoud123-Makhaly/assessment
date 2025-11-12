import { Button, Col, Container, Input, Row } from "reactstrap";
import TaskCard from "./components/task/TaskCard";
import UseQuery from "./hooks/UseQuery";
import type { ITask, ITaskForm } from "./interfaces";
import { addTaskForm, CardsData } from "./data";
import { useEffect, useState } from "react";
import Search from "./components/search/Search";
import ModalMaker from "./components/ui/modal/ModalMaker";
import AxiosInstance from "./config/axios.config";

const App = () => {
  const { data, refetch, isLoading } = UseQuery({
    queryKey: ["tasks"],
    url: "/tasks",
  });
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [search, setSearch] = useState<string>("");
  const [isOpenAddModal, setIsOpenAddModal] = useState<boolean>(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState<boolean>(false);
  const [taskToAdd, setTaskToAdd] = useState<ITask>({
    id: 0,
    title: "",
    description: "",
    column: "",
  });
  const [taskIdToEdit, setTaskIdToEdit] = useState<ITask>({
    title: "",
    description: "",
    column: "",
  });
  const toggleAddModal = () => setIsOpenAddModal(!isOpenAddModal);
  const toggleEditModal = () => setIsOpenEditModal(!isOpenEditModal);
  useEffect(() => {
    if (data?.data) {
      setTasks(data.data);
    }
  }, [data]);

  const handleOnDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  const handleOnDrop = async (
    e: React.DragEvent<HTMLDivElement>,
    newColumn: string
  ) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");

    // Optimistically update UI
    setTasks((prev: ITask[]) =>
      prev.map((task: ITask) =>
        String(task.id) === taskId ? { ...task, column: newColumn } : task
      )
    );

    try {
      // Find the dragged task
      const movedTask = tasks.find((t) => String(t.id) === taskId);
      if (!movedTask) return;

      // Update in backend
      await AxiosInstance.put(`/tasks/${taskId}`, {
        ...movedTask,
        column: newColumn,
      });

      // Re-fetch fresh data
      refetch();
    } catch (err) {
      console.error("Failed to update task column:", err);
    }
  };

  const filteredData = tasks.filter((task: ITask) =>
    task.title.toLowerCase().includes(search.toLowerCase())
  );
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!taskToAdd.title || !taskToAdd.description || !taskToAdd.column) return;
    const newTask = {
      title: taskToAdd.title,
      description: taskToAdd.description,
      column: taskToAdd.column,
    };
    setTasks((prev) => [...prev, newTask]);

    await AxiosInstance.post("/tasks", newTask);

    toggleAddModal();
    setTaskToAdd({
      id: 0,
      title: "",
      description: "",
      column: "",
    });
    refetch();
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTaskToAdd((prev) => ({ ...prev, [name]: value }));
  };
  // ****************************************************************
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTaskIdToEdit((prev) => ({ ...prev, [name]: value }));
  };
  const handleEditTask = (taskId: number | undefined) => {
    setIsOpenEditModal(true);
    const taskToEdit = tasks.find((task: ITask) => task.id === taskId);
    if (taskToEdit) {
      setTaskIdToEdit(taskToEdit);
    }
  };
  const handleSubmitEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !taskIdToEdit.title ||
      !taskIdToEdit.description ||
      !taskIdToEdit.column
    )
      return;

    try {
      const updatedTask = {
        id: taskIdToEdit.id,
        title: taskIdToEdit.title,
        description: taskIdToEdit.description,
        column: taskIdToEdit.column,
      };

      await AxiosInstance.put(`/tasks/${taskIdToEdit.id}`, updatedTask);

      setTasks((prev) =>
        prev.map((task) => (task.id === taskIdToEdit.id ? updatedTask : task))
      );

      refetch();

      toggleEditModal();
      setTaskIdToEdit({
        id: 0,
        title: "",
        description: "",
        column: "",
      });
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  return (
    <main className="py-5">
      <Container>
        <div className="d-flex gap-3 align-items-center">
          <Search search={search} setSearch={setSearch} />
          <Button
            className="btn btn-info text-white text-nowrap"
            onClick={toggleAddModal}
          >
            Add Task
          </Button>
        </div>
        <Row>
          {CardsData.map((card) => (
            <Col
              md={6}
              lg={4}
              xl={3}
              key={card.id}
              onDragOver={handleOnDragOver}
              onDrop={(e) => handleOnDrop(e, card.title)}
            >
              <TaskCard
                tasks={filteredData.filter(
                  (task: ITask) => task.column === card.title
                )}
                title={card.title}
                titleBg={card.color}
                setTasks={setTasks}
                refetch={refetch}
                isLoading={isLoading}
                onEditTask={handleEditTask}
              />
            </Col>
          ))}
        </Row>
      </Container>
      <ModalMaker
        title="Add Task"
        isOpen={isOpenAddModal}
        toggle={toggleAddModal}
      >
        <form onSubmit={handleSubmit}>
          {addTaskForm.map((input: ITaskForm) =>
            input.type === "select" ? (
              <Input
                type="select" // CHANGE: Use select for column
                className="form-control mb-3"
                name={input.name}
                value={taskToAdd[input.name]}
                onChange={handleChange}
                required
              >
                <option disabled value="">
                  Select Column
                </option>
                {CardsData.map((card) => (
                  <option key={card.id} value={card.title}>
                    {card.title}
                  </option>
                ))}
              </Input>
            ) : (
              <Input
                type={input.type}
                placeholder={input.placeholder}
                className="form-control mb-3"
                name={input.name}
                value={taskToAdd[input.name]}
                onChange={handleChange}
                required
              />
            )
          )}

          <Button className="btn btn-info w-100 text-white">Submit</Button>
        </form>
      </ModalMaker>
      {/* edit modal *******************************  */}
      <ModalMaker
        title=" Edit Task"
        isOpen={isOpenEditModal}
        toggle={toggleEditModal}
      >
        <form onSubmit={handleSubmitEdit}>
          {addTaskForm.map((input: ITaskForm) =>
            input.type === "select" ? (
              <Input
                type="select"
                className="form-control mb-3"
                name={input.name}
                value={taskIdToEdit[input.name]}
                onChange={handleEditChange}
                required
              >
                <option disabled value="">
                  Select Column
                </option>
                {CardsData.map((card) => (
                  <option key={card.id} value={card.title}>
                    {card.title}
                  </option>
                ))}
              </Input>
            ) : (
              <Input
                type={input.type}
                placeholder={input.placeholder}
                className="form-control mb-3"
                name={input.name}
                value={taskIdToEdit[input.name]}
                onChange={handleEditChange}
                required
              />
            )
          )}

          <Button className="btn btn-info w-100 text-white">Submit</Button>
        </form>
      </ModalMaker>
    </main>
  );
};
export default App;
