import { redirect } from "next/navigation";

const Homepage = () => {
  return redirect("/sign-in");
};

export default Homepage;
