import { Outlet } from "react-router-dom";
import Navbar from "@/components/recruiter/Navbar";
import { useAppSelector } from "@/store/hooks";

export const RecruiterLayout = () => {
  const user = useAppSelector((s) => s.auth.user);
  return (
    <div className="scope-recruiter">
      {user && <Navbar user={user} />}
      <Outlet />
    </div>
  );
};
