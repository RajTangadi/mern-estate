import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';


const Profile = () => {
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  // const [filePerc, setFilePerc] = useState(0);
  // const [fileUploadError, setFileUploadError] = useState(false);
  // const [fileUploading, setFileUploading] = useState(false);
  const { currentUser } = useSelector((state) => state.user);


  // useEffect(() => {
  //   if (file) {
  //     handleFileUpload(file);
  //   }
  // }, [file]);

  
  // const handleFileUpload = async (file) => {
  //   // Reset states
  //   setFileUploadError(false);
  //   setFileUploading(true);
  //   setFilePerc(0);

  //   // Validate file type
  //   const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  //   if (!allowedTypes.includes(file.type)) {
  //     setFileUploadError('Only image files are allowed');
  //     setFileUploading(false);
  //     toast.error('Only image files are allowed', {
  //       position: "top-center",
  //       autoClose: 3000
  //     });
  //     return;
  //   }

  //   try {
  //     // Create form data
  //     const formData = new FormData();
  //     formData.append('file', file);

  //     // Upload with progress tracking
  //     const response = await axios.post('/api/user/upload', formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //       },
  //       onUploadProgress: (progressEvent) => {
  //         const percentCompleted = Math.round(
  //           (progressEvent.loaded * 100) / progressEvent.total
  //         );
  //         setFilePerc(percentCompleted);
  //       },
  //     });

      
  //     // Show success message
  //     toast.success('Profile picture updated successfully', {
  //       position: "top-center",
  //       autoClose: 1000
  //     });

  //     // Reset states
  //     setFileUploading(false);
  //     setTimeout(() => setFilePerc(0), 1000);
  //   } catch (error) {
  //     console.error('Upload error:', error);
  //     setFileUploadError(true);
  //     setFileUploading(false);
  //     toast.error(error.response?.data?.message || 'Error uploading image', {
  //       position: "top-center",
  //       autoClose: 3000
  //     });
  //   }

  // }


  // const handleFileUpload = async (file) => {
  //   const formData = new FormData();
  //   formData.append("file", file);
  //   formData.append("upload_preset", "ml_default");
  //   const uploadRes = await fetch(
  //     "https://api.cloudinary.com/v1_1/dthh326zq/image/upload",
  //     {
  //       method: "POST",
  //       body: formData,
  //     }
  //   );
  //   const data = await uploadRes.json();
  //   console.log(data);
  // };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-5">
        <input type="file"
        onChange={(e) => setFile(e.target.files[0])}
         ref={fileRef} accept="image/*" hidden />
        <img
          src={`${currentUser.avatar}`}
          onClick={() => fileRef.current.click()}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />
        {/* {fileUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
            <div className="text-white font-bold">{filePerc}%</div>
          </div>
        )}
        {fileUploadError && (
          <p className="text-red-500 text-center">
            Error uploading image
          </p>
        )} */}
        <input
          type="text"
          placeholder="username"
          name="username"
          className=" border-gray-500/50  p-3 rounded-lg bg-white focus:outline-none focus:border-transparent"
        />
        <input
          type="email"
          placeholder="email"
          name="email"
          className=" border-gray-500/50 p-3 rounded-lg bg-white focus:outline-none focus:border-transparent"
        />
        <input
          type="password"
          placeholder="password"
          name="password"
          className=" border-gray-500/50 p-3 rounded-lg bg-white focus:outline-none focus:border-transparent"
        />
        <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
          Update
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer">Delete Account</span>
        <span className="text-red-700 cursor-pointer">Sign Out</span>
      </div>
    </div>
  );
};

export default Profile;
