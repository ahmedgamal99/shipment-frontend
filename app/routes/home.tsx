// Removed unused/broken Route type import; not required for this file.
import { Welcome } from "../welcome/welcome";
import { Button } from "~/components/ui/button";

export function meta() {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return <Button> Welcome </Button>;
}
