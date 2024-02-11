import { useForm } from "react-hook-form";
import { ILoginForm, ICommonResponse } from "../shared-types";
import { useMutation, useQueryClient } from "react-query";
import { api_client } from "../api-client";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../hooks/useAppContext";

const Signin = () => {
  const navigate = useNavigate();
  const context = useAppContext();
  const queryClient = useQueryClient()
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<ILoginForm>();

  const mutation = useMutation(api_client.login, {
    onSuccess: async (data: ICommonResponse) => {
      queryClient.invalidateQueries("validate-token")
      toast.success(data.message);
      navigate("/");
    },
    onError: (error: AxiosError<ICommonResponse>) => {
      toast.error(error.response?.data?.message);
    },
  });

  // if (context?.isLoggedIn === true) {
  //   navigate("/");
  //   return <></>;
  // }

  const onSubmit = (data: ILoginForm) => {
    mutation.mutate(data);
  };

  return (
    <div className="px-60 py-10">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-5">
        <h2 className="text-3xl font-bold">Log in to your account</h2>
        <label>
          <p className="text-lg font-semibold">Email</p>
          <input
            type="email"
            className="border-2 w-1/2 p-2 rounded-md"
            {...register("email", { required: "Email field is required" })}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </label>

        <label>
          <p className="text-lg font-semibold">Password</p>
          <input
            type="password"
            className="border-2 w-1/2 p-2 rounded-md"
            {...register("password", { required: "Password field is required" })}
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </label>

        <button className="p-3 rounded-md bg-green-800 text-slate-100 opacity-90 hover:opacity-100 w-1/4">Login</button>
      </form>
    </div>
  );
};

export default Signin;
