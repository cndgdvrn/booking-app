import { useForm } from "react-hook-form";
import { api_client } from "../api-client";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { delay } from "../helpers/delay";
import { AxiosError } from "axios";
import { IRegisterResponse, IRegisterForm } from "../shared-types";

const Register = () => {
  const navigate = useNavigate();
  const mutation = useMutation(api_client.register, {
    onSuccess: async (data: IRegisterResponse) => {
      toast.success(data.message);
      await delay(1000);
      navigate("/");
    },
    onError: (error: AxiosError<IRegisterResponse>) => {
      toast.error(error.response?.data.message);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<IRegisterForm>();

  const onSubmit = async (data: IRegisterForm) => {
    mutation.mutate(data);
  };

  return (
    <div className="px-60 py-10">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-3">
        <h2 className="text-3xl font-bold">Create an Account</h2>
        <div className="flex items-center gap-x-4">
          <label className="flex-1">
            <p className="text-lg font-semibold">First Name</p>
            <input
              className="border-2 p-2 w-full rounded-md"
              {...register("firstName", { required: "First name is required" })}
              placeholder="First Name"
            />
            {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
          </label>

          <label className="flex-1">
            <p className="text-lg font-semibold">Last Name</p>
            <input
              className="border-2 p-2 w-full rounded-md"
              {...register("lastName", { required: "Last name is required" })}
              placeholder="Last Name"
            />
            {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
          </label>
        </div>

        <label>
          <p className="text-lg font-semibold">Email</p>
          <input
            type="email"
            className="border-2 p-2 w-[calc(50%-8px)] rounded-md"
            {...register("email", {
              required: "Email is required",
              validate: (val) => {
                if (!val.includes("@")) {
                  return "Invalid email format";
                }
              },
            })}
            placeholder="Email"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </label>

        <label>
          <p className="text-lg font-semibold">Password</p>
          <input
            type="password"
            className="border-2 p-2 w-[calc(50%-8px)] rounded-md"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must have at least 6 characters",
              },
            })}
            placeholder="Password"
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </label>

        <label>
          <p className="text-lg font-semibold">Confirm Password</p>
          <input
            type="password"
            className="border-2 p-2 w-[calc(50%-8px)] rounded-md"
            {...register("confirmPassword", {
              required: "Confirm password is required",
              validate: (val) => {
                if (!val) {
                  return "Password is required";
                }
                if (val !== watch("password")) {
                  return "Passwords do not match";
                }
                return;
              },
            })}
            placeholder="Password"
          />
          {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
        </label>

        <div className="flex justify-between items-center">
          <p className="font-bold">
            Already registered? <span className=" underline">Sign in here</span>
          </p>
          <button
            className="p-4 text-lg w-max bg-green-500 text-slate-100 rounded-md opacity-90 hover:opacity-100"
            type="submit"
          >
            Create an Account
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
