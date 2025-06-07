import { SearchInputFeature } from "@/features/search/SearchInputFeature";

interface Props {
  searchLocationList: Array<"all" | "projects" | "tasks" | "clients" | "users">;
}

/**
 * Widget-прокси: просто вызывает feature-компонент поиска
 */
export default function SearchInputWidget(props: Props) {
  return <SearchInputFeature {...props} />;
}
