import { SearchFeature } from "@/features/search/SearchFeature";

interface props {
  searchLocationList: Array<"all" | "projects" | "tasks" | "clients" | "users">;
}

export default function SearchWidget({ searchLocationList }: props) {
  return <SearchFeature searchLocationList={searchLocationList} />;
}
