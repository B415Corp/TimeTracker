import { PAYMENT } from "@/shared/interfaces/task.interface";
import React from "react";

interface Props {
  value: string;
}

export default function RateItem({ value }: Props) {
  return <span className="font-semibold">{value}</span>;
}
