import { useTitle, useAuthContext } from "@hooks";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FormFields, FormUi } from "@layouts";
import { registerOptions } from "@utils";
import { userService } from "@services";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();
  const navigate = useNavigate;
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  useTitle("Login to PINSHOT");

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };
  const onFormSubmit = async (data) => {
    console.log(data)
  }

  return (
    <FormUi
      title="Welcome, Login"
      info="Don't havr an account?"
      to="/signup"
      path="Sign up"
      btnText="Login"
      onSubmit={handleSubmit(onFormSubmit)}
      isSubmitting={isSubmitting}
    >
      <FormFields
        register={register}
        errors={errors?.userName}
        registerOptions={registerOptions?.userName}
        className="my-4 text-black"
        id="userName"
        label="Username"
        name="userName"
        type="text"
        placehoder="Username"
      />
      <FormFields
        register={register}
        errors={errors?.password}
        registerOptions={registerOptions?.password}
        className="my-1 text-black position-relative"
        id="password"
        label="Password"
        name="Password"
        type="password"
        placehoder="Password"
        showPassword={showPassword}
        togglePassword={togglePassword}
      />
      <div
        className="w-100 text-end my-2"
        style={{ color: "var(--orangelight), fontWeight:500" }}
      >
        <Link to="/forgot-password">Forgot Password</Link>
      </div>
    </FormUi>
  );
}
