import { useSelector, useDispatch } from "react-redux";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
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
  const [showListingError, setShowListingError] = useState(false);
  const [toggelShowListing, setToggelShowListing] = useState(false);
  const [userListing, setUserListing] = useState([]);
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

  const handleShowListings = async () => {
    try {
      setShowListingError(false);
      setToggelShowListing(!toggelShowListing);
      // console.log(toggelShowListing);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      // console.log(data);
      if (data.success === false) {
        setShowListingError(true);
        toast.error("Error showing listings", {
          position: "top-center",
          autoClose: 1000,
        });
      }
      setUserListing(data);
    } catch (error) {
      setShowListingError(true);
      toast.error("Error showing listings", {
        position: "top-center",
        autoClose: 1000,
      });
    }
  };

  const handleDeleteListing = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        toast.error("Error deleting listing", {
          position: "top-center",
          autoClose: 1000,
        });
        return;
      }
      toast.success("Listing deleted successfully", {
        position: "top-center",
        autoClose: 1000,
      });
      setUserListing((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      toast.error("Error deleting listing", {
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
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80 cursor-pointer"
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
      <button
        onClick={handleShowListings}
        className="bg-green-700 w-full mt-10 text-white p-3 rounded-lg uppercase text-center hover:opacity-95 cursor-pointer"
      >
        Show listing
      </button>
      <p className="text-red-700 mt-5">
        {showListingError && "Error showing listing!"}
      </p>

      {toggelShowListing && userListing && userListing.length > 0 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-center mt-7 text-2xl font-semibold">
            Your Listing
          </h1>
          {userListing.map((listing) => (
            <div
              key={listing._id}
              className="border border-gray-400 rounded-lg p-3 flex justify-between items-center gap-4"
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt="listing image"
                  className="h-20 w-20 object-contain rounded-2xl"
                />
              </Link>
              <Link
                to={`/listing/${listing._id}`}
                className="text-slate-700 font-semibold flex-1 hover:underline truncate"
              >
                <p>{listing.name}</p>
              </Link>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleDeleteListing(listing._id)}
                  className="text-red-700 uppercase cursor-pointer"
                >
                  Delete
                </button>
                <button className="text-green-700 cursor-pointer uppercase">
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
