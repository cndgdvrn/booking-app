import { useMutation, useQueryClient } from "react-query";
import { api_client } from "../api-client";
import { toast } from "react-toastify";

const Signout = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation(api_client.logout, {
    onSuccess: () => {
      queryClient.invalidateQueries("validate-token");
      toast.success("Logged out");
    },
    onError: (error:any) => {
      console.log(error);
      toast.error("Error occured - logging out");
    },
  });

  const handleClick = () => {
    mutation.mutate();
  };

  return (
    <button onClick={handleClick} className="bg-red-500 text-white p-2 rounded-md ">
      Sign out
    </button>
  );
};

export default Signout;
