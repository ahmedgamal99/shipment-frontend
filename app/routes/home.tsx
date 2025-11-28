// Removed unused/broken Route type import; not required for this file.
import { Link } from "react-router";
import { Welcome } from "../welcome/welcome";
import { Button } from "~/components/ui/button";

export function meta() {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <h1 className="mb-4 text-3xl font-bold">Welcome To FastShip</h1>
      <p className="mb-8 text-center text-lg text-muted-foreground">
        Your all-in-one shipping solution for businesses of all sizes.
      </p>
      <Button className="mt-4">
        <Link to="/seller/login">Get Started as Seller</Link>
      </Button>
      <Button className="mt-4">
        <Link to="/partner/login">Get Started as Partner</Link>
      </Button>
    </div>
  );
}
