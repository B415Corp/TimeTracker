import React from "react";
import {useGetWeeklyStatsQuery} from "@/shared/api/time-log.service";
import {Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {Card, CardContent, CardHeader, CardTitle} from "@ui/card";
import {Skeleton} from "@/shared/ui/skeleton";

export function WeeklyStats() {
  const {data, isLoading, isError} = useGetWeeklyStatsQuery();

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Статистика недели</CardTitle>
        </CardHeader>
        <CardContent className="h-56 flex items-center justify-center">
          <Skeleton className="w-full h-40" />
        </CardContent>
      </Card>
    );
  }

  if (isError || !data) return null;

  const chartData = data.projects.map((p) => ({
    name: p.project_name,
    hours: +(p.total_duration / 3600000).toFixed(2),
  }));

  return (
    <div className="w-full flex flex-col gap-4 pb-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Статистика недели</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData} margin={{top: 20, right: 30, left: 0, bottom: 5}}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="hours" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {data.top_tasks.length > 0 && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle>ТОП-3 задач</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-1">
              {data.top_tasks.map((t) => (
                <li key={t.task_id}>
                  {t.task_name} — {(t.total_duration / 3600000).toFixed(2)} ч
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 