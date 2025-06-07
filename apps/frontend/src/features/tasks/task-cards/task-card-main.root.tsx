import { createContext, useContext, ReactNode } from "react";
import { ROUTES } from "@/app/router/routes.enum";
import { Button } from "@ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@ui/card";
import { useNavigate } from "react-router-dom";
import { PAYMENT } from "@/shared/interfaces/task.interface";
import { RateItem } from "@/entities/rate";

// Определяем тип значения контекста
interface context {
  project_id: string;
  task_id: string;
  name: string;
  symbol: string;
  rate: number;
  payment_type: PAYMENT;
}

// Создаём контекст с типом, по умолчанию null
const TaskCardMainContext = createContext<context | null>(null);

interface props extends context {
  children: ReactNode;
}

function Root({ children, ...props }: props) {
  return (
    <TaskCardMainContext.Provider value={props}>
      <Card key={props.project_id} className="min-w-64 w-96 md:w-fit">
        {children}
      </Card>
    </TaskCardMainContext.Provider>
  );
}

// Хук для удобного использования контекста с проверкой на null
function useTaskCardMain() {
  const context = useContext(TaskCardMainContext);
  if (!context) {
    throw new Error(
      "useTaskCardMain должен использоваться внутри TaskCardMain.Provider"
    );
  }
  return context;
}

function Header() {
  const { name, task_id } = useTaskCardMain();
  return (
    <CardHeader>
      <div className="flex items-center gap-2">
        <CardTitle>{name}</CardTitle>
      </div>
    </CardHeader>
  );
}
function Body() {
  const { symbol, rate, payment_type } = useTaskCardMain();
  return (
    <CardContent>
      <RateItem value={symbol + rate} />
    </CardContent>
  );
}

function Footer() {
  const navigate = useNavigate();
  const { task_id } = useTaskCardMain();
  return (
    <CardFooter>
      <Button onClick={() => navigate(`/${ROUTES.TASKS}/${task_id}`)}>
        Перейти
      </Button>
    </CardFooter>
  );
}

const TaskCardMain = {
  Root: Root,
  Header: Header,
  Body: Body,
  Footer: Footer,
};

export default TaskCardMain;
