interface Props {
  value: string;
}

export function RateItem({ value }: Props) {
  return <span className="font-semibold">{value}</span>;
}
