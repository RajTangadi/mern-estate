import { useSelector, useDispatch } from "react-redux";
import { useRef, useState } from "react";
import {Link} from "react-router-dom";
import {
  updateUserStart,
  updateUserSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserFailure,
  deleteUserSuccess,
  signOutUserStart,
  signOutUserFailure,
  signOutUserSuccess,
} from "../redux/user/userSlice";
import { toast } from "react-toastify";
import { Oval } from "react-loader-spinner";

const Profile = () => {
  const fileRef = useRef(null);
  const [file, setFile] = useState(null);
  const { currentUser, loading } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // console.log("formdata", formData);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setFile(selectedFile);
    } else {
      toast.error("Only image files are allowed!");
      setFile(null);
    }
  };

  // console.log("File1", file);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      console.log("fetching");
      const formDataObj = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataObj.append(key, value);
      });
      if (file) {
        formDataObj.append("avatar", file);
      }

      for (let pair of formDataObj.entries()) {
        console.log("FormData:", pair[0], pair[1]); // Debug FormData contents
      }

      // console.log("form data object", formDataObj);

      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        credentials: "include",
        body: formDataObj,
      });

      if (!res.ok) {
        const data = await res.json();
        dispatch(updateFailure(data.message));
        toast.error(data.message);
        return;
      }

      const data = await res.json();
      if (data.success === false) {
        dispatch(updateFailure(data.message));
        toast.error(data.message);
        return;
      }

      dispatch(updateUserSuccess(data));
      toast.success("Profile updated successfully");
    } catch (error) {
      dispatch(updateFailure(error.message || "Error updating user"));
      toast.error(error.message || "Error updating user");
    }
  };

  const handleDeleteUser = async () => {
        try {
          dispatch(deleteUserStart());
          const res = await fetch(`/api/user/delete/${currentUser._id}`, {
            method: "DELETE",
          });
          const data = await res.json();
          if (data.success === false) {
            dispatch(deleteUserFailure(data.message));
            toast.error(data.message, {
              position: "top-center",
              autoClose: 1000,
            });
            return;
          }
          dispatch(deleteUserSuccess(data));
          toast.success("User deleted successfully", {
            position: "top-center",
            autoClose: 1000,
          });

        } catch (error) {
          dispatch(deleteUserFailure(error.message || "Error deleting user"));
          toast.error(error.message || "Error deleting user", {
            position: "top-center",
            autoClose: 1000,
          });
        }
      };
    
      const handleSignOut = async () => {
        try {
          dispatch(signOutUserStart());
          const res = await fetch("/api/auth/signout");
          const data = await res.json();
          if (data.success === false) {
            dispatch(signOutUserFailure(data.message));
            toast.error(data.message, {
              position: "top-center",
              autoClose: 1000,
            });
            return;
          }
          toast.success("Signed out successfully", {
            position: "top-center",
            autoClose: 1000,
          });
          dispatch(signOutUserSuccess());
        } catch (error) {
          dispatch(signOutUserFailure(error.message || "Error signing out"));
          toast.error(error.message || "Error signing out", {
            position: "top-center",
            autoClose: 1000,
          });
        }
      };
    

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <input
          type="file"
          ref={fileRef}
          accept="image/*"
          hidden
          onChange={handleFileChange}
        />
        <img
          src={currentUser.avatar || "default_avatar.png"}
          onClick={() => fileRef.current.click()}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2 mb-5"
        />

        <input
          type="text"
          placeholder="Username"
          name="username"
          defaultValue={currentUser.username}
          onChange={handleChange}
          className="border-gray-500/50 p-3 rounded-lg bg-white focus:outline-none focus:border-transparent"
        />
        <input
          type="email"
          placeholder="Email"
          name="email"
          defaultValue={currentUser.email}
          onChange={handleChange}
          className="border-gray-500/50 p-3 rounded-lg bg-white focus:outline-none focus:border-transparent"
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          onChange={handleChange}
          className="border-gray-500/50 p-3 rounded-lg bg-white focus:outline-none focus:border-transparent"
        />
        <button
          type="submit"
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
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
            />          ) : (
            "Update"
          )}
        </button>
        <Link
          to="/create-listing"
          className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
        >
          Create listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span
          onClick={handleDeleteUser}
          className="text-red-700 cursor-pointer"
        >
          Delete Account
        </span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">
          Sign Out
        </span>
      </div>
    </div>
  );
};

export default Profile;

// import { useSelector } from "react-redux";
// import { useRef, useState } from "react";
// import {
//   updateUserStart,
//   updateUserSuccess,
//   updateFailure,
//   deleteUserStart,
//   deleteUserSuccess,
//   deleteUserFailure,
//   signOutUserStart,
//   signOutUserSuccess,
//   signOutUserFailure,
// } from "../redux/user/userSlice";
// import { useDispatch } from "react-redux";
// // import axios from 'axios';
// import { toast } from "react-toastify";
// import { Oval } from "react-loader-spinner";
// import { Link } from "react-router-dom";

// const Profile = () => {
//   const fileRef = useRef(null);
//   const [file, setFile] = useState(undefined);
//   // const [filePerc, setFilePerc] = useState(0);
//   // const [fileUploadError, setFileUploadError] = useState(false);
//   // const [fileUploading, setFileUploading] = useState(false);
//   const { currentUser, loading } = useSelector((state) => state.user);
//   const [formData, setFormData] = useState({});

//   const dispatch = useDispatch();

//   const handleChange = (e) => {
//     setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       dispatch(updateUserStart());
//       console.log("fetching");

//       const res = await fetch(`/api/user/update/${currentUser._id}`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         credentials: "include",
//         body: JSON.stringify(formData),
//       });
//       const data = await res.json();
//       console.log(data);
//       if (data.success === false) {
//         dispatch(updateFailure(data.message));
//         return;
//       }
//       dispatch(updateUserSuccess(data));
//       toast.success("Profile updated successfully", {
//         position: "top-center",
//         autoClose: 1000,
//       });
//     } catch (error) {
//       dispatch(updateFailure(error.message || "Error updating user"));
//       toast.error(error.message || "Error updating user", {
//         position: "top-center",
//         autoClose: 1000,
//       });
//     }
//   };

//   const handleDeleteUser = async () => {
//     try {
//       dispatch(deleteUserStart());
//       const res = await fetch(`/api/user/delete/${currentUser._id}`, {
//         method: "DELETE",
//       });
//       const data = await res.json();
//       if (data.success === false) {
//         dispatch(deleteUserFailure(data.message));
//         toast.error(data.message, {
//           position: "top-center",
//           autoClose: 1000,
//         });
//         return;
//       }
//       dispatch(deleteUserSuccess(data));
//       toast.success("User deleted successfully", {
//         position: "top-center",
//         autoClose: 1000,
//       });
//       // setTimeout(() => {
//       //   window.location.replace("/");
//       // }, 1000);
//     } catch (error) {
//       dispatch(deleteUserFailure(error.message || "Error deleting user"));
//       toast.error(error.message || "Error deleting user", {
//         position: "top-center",
//         autoClose: 1000,
//       });
//     }
//   };

//   const handleSignOut = async () => {
//     try {
//       dispatch(signOutUserStart());
//       const res = await fetch("/api/auth/signout");
//       const data = await res.json();
//       if (data.success === false) {
//         dispatch(signOutUserFailure(data.message));
//         toast.error(data.message, {
//           position: "top-center",
//           autoClose: 1000,
//         });
//         return;
//       }
//       toast.success("Signed out successfully", {
//         position: "top-center",
//         autoClose: 1000,
//       });
//       dispatch(signOutUserSuccess());
//     } catch (error) {
//       dispatch(signOutUserFailure(error.message || "Error signing out"));
//       toast.error(error.message || "Error signing out", {
//         position: "top-center",
//         autoClose: 1000,
//       });
//     }
//   };




//   //   try {
//   //     // Create form data
//   //     const formData = new FormData();
//   //     formData.append('file', file);

//   //     // Upload with progress tracking
//   //     const response = await axios.post('/api/user/upload', formData, {
//   //       headers: {
//   //         'Content-Type': 'multipart/form-data',
//   //       },
//   //       onUploadProgress: (progressEvent) => {
//   //         const percentCompleted = Math.round(
//   //           (progressEvent.loaded * 100) / progressEvent.total
//   //         );
//   //         setFilePerc(percentCompleted);
//   //       },
//   //     });

//   //     // Show success message
//   //     toast.success('Profile picture updated successfully', {
//   //       position: "top-center",
//   //       autoClose: 1000
//   //     });

//   //     // Reset states
//   //     setFileUploading(false);
//   //     setTimeout(() => setFilePerc(0), 1000);
//   //   } catch (error) {
//   //     console.error('Upload error:', error);
//   //     setFileUploadError(true);
//   //     setFileUploading(false);
//   //     toast.error(error.response?.data?.message || 'Error uploading image', {
//   //       position: "top-center",
//   //       autoClose: 3000
//   //     });
//   //   }

//   // }

//   // const handleFileUpload = async (file) => {
//   //   const formData = new FormData();
//   //   formData.append("file", file);
//   //   formData.append("upload_preset", "ml_default");
//   //   const uploadRes = await fetch(
//   //     "https://api.cloudinary.com/v1_1/dthh326zq/image/upload",
//   //     {
//   //       method: "POST",
//   //       body: formData,
//   //     }
//   //   );
//   //   const data = await uploadRes.json();
//   //   console.log(data);
//   // };

//   return (
//     <div className="p-3 max-w-lg mx-auto">
//       <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
//       <form onSubmit={handleSubmit} className="flex flex-col gap-5">
//         <input
//           type="file"
//           onChange={(e) => setFile(e.target.files[0])}
//           ref={fileRef}
//           accept="image/*"
//           hidden
//         />
//         <img
//           src={`${currentUser.avatar}`}
//           onClick={() => fileRef.current.click()}
//           alt="profile"
//           className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2 mb-5"
//         />
//         {/* {fileUploading && (
//           <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
//             <div className="text-white font-bold">{filePerc}%</div>
//           </div>
//         )}
//         {fileUploadError && (
//           <p className="text-red-500 text-center">
//             Error uploading image
//           </p>
//         )} */}
//         <input
//           type="text"
//           placeholder="username"
//           name="username"
//           className=" border-gray-500/50  p-3 rounded-lg bg-white focus:outline-none focus:border-transparent"
//           defaultValue={currentUser.username}
//           onChange={handleChange}
//         />
//         <input
//           type="email"
//           placeholder="email"
//           name="email"
//           className=" border-gray-500/50 p-3 rounded-lg bg-white focus:outline-none focus:border-transparent"
//           defaultValue={currentUser.email}
//           onChange={handleChange}
//         />
//         <input
//           type="password"
//           placeholder="password"
//           name="password"
//           className=" border-gray-500/50 p-3 rounded-lg bg-white focus:outline-none focus:border-transparent"
//           onChange={handleChange}
//         />
//         <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80 cursor-pointer">
//           {loading ? (
//             <Oval
//               visible={true}
//               height="30"
//               width="30"
//               color="#fff"
//               strokeWidth={5}
//               ariaLabel="oval-loading"
//               wrapperStyle={{ display: "flex", justifyContent: "center" }}
//               wrapperClass=""
//             />
//           ) : (
//             "Update"
//           )}
//         </button>
//         <Link
//           to="/create-listing"
//           className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
//         >
//           Create listing
//         </Link>
//       </form>
//       <div className="flex justify-between mt-5">
//         <span
//           onClick={handleDeleteUser}
//           className="text-red-700 cursor-pointer"
//         >
//           Delete Account
//         </span>
//         <span onClick={handleSignOut} className="text-red-700 cursor-pointer">
//           Sign Out
//         </span>
//       </div>
//     </div>
//   );
// };

// export default Profile;
