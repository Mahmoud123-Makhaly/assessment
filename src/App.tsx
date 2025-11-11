import { Button, Col, Container, Input, Row } from "reactstrap";
import TaskCard from "./components/task/TaskCard";
import UseQuery from "./hooks/UseQuery";
import type { IAddTaskForm, ITask } from "./interfaces";
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
  const [taskToAdd, setTaskToAdd] = useState<ITask>({
    id: 0,
    title: "",
    description: "",
    column: "",
  });
  const toggleAddModal = () => setIsOpenAddModal(!isOpenAddModal);
  useEffect(() => {
    if (data?.data) {
      setTasks(data.data);
    }
  }, [data]);

  const handleOnDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  const handleOnDrop = (e: React.DragEvent<HTMLDivElement>, title: string) => {
    const taskId = e.dataTransfer.getData("taskId");

    setTasks((prev: ITask[]) =>
      prev.map((task) =>
        task.id === Number(taskId) ? { ...task, column: title } : task
      )
    );
  };
  const filteredData = tasks.filter((task: ITask) =>
    task.title.toLowerCase().includes(search.toLowerCase())
  );
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!taskToAdd.title || !taskToAdd.description || !taskToAdd.column) return;
    const newTask = {
      id: tasks.length + 1,
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
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTaskToAdd((prev) => ({ ...prev, id: Date.now(), [name]: value }));
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
          {addTaskForm.map((input: IAddTaskForm) =>
            input.type === "select" ? (
              <Input
                type="select" // CHANGE: Use select for column
                className="form-control mb-3"
                name={input.name}
                value={taskToAdd[input.name]}
                onChange={handleChange}
                required
              >
                <option value="">Select Column</option>
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
    </main>
  );
};
export default App;
