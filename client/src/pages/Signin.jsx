import { useState } from "react";
import { Oval } from "react-loader-spinner";
import { Link, useNavigate } from "react-router-dom";
import { Bounce, toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  sigInStart,
  sigInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import OAuth from "../components/OAuth";

const Signin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { loading } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(sigInStart());

    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      // Handle network errors and non-2xx status codes
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({
          message: `Request failed with status ${res.status}`,
        }));

        throw new Error(errorData.message || "Something went wrong");
      }

      const data = await res.json();

      // Handle API-level errors
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        throw new Error(data.message || "Registration failed");
      }

      // Success case
      toast.success("Registered Successfully", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });

      dispatch(sigInSuccess(data));
      navigate("/");
    } catch (error) {
      // Handle all errors in one place
      dispatch(signInFailure(error.message));
      toast.error(error.message, {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });

      // Optionally log error for debugging
      console.error("Signup error:", error);

      return null; // Indicate error to caller
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7"> Sign In</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="email"
          className="border p-3 rounded-lg"
          name="email"
          onChange={handleChange}
        />

        <input
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg"
          name="password"
          onChange={handleChange}
        />

        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 cursor-pointer rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? (
            <Oval
              visible={true}
              height="30"
              width="30"
              color="#fff"
              strokeWidth={5}
              ariaLabel="oval-loading"
              wrapperStyle={{ display: "flex", justifyContent: "center" }}
              wrapperClass=""
            />
          ) : (
            "Sign In"
          )}
        </button>
        <OAuth />
      </form>
      <div className="flex gap-2 mt-5">
        <p>dont have an account ?</p>
        <Link to="/sign-up" className="text-blue-700">
          Sign up
        </Link>
      </div>
    </div>
  );
};

export default Signin;
