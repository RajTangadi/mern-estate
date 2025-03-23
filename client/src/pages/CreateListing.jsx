import { useState } from "react";
import { Oval } from "react-loader-spinner";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Slide, toast } from "react-toastify";

const CreateListing = () => {
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    parking: false,
    furnished: false,
    offer: false,
    address: "",
  });


  const [imageUploadError, setImageUploadError] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === "number" ||
      e.target.type === "textarea" ||
      e.target.type === "text"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // setUploading(true);
    // console.log(formData);
    try {
      if (formData.imageUrls.length < 1) {
        return setError("Please upload atleast one image");
      }
      if (+formData.regularPrice < +formData.discountPrice) {
        return setError("Discount price cannot be greater than regular price");
      }
      setLoading(true);
      setError(false);
      const res = await fetch("/api/listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, userRef: currentUser._id }),
      });

      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
        return;
      }
      toast.success("Listing created successfully", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Slide,
      });
      setFormData({
        imageUrls: [],
        name: "",
        description: "",
        type: "rent",
        bedrooms: 1,
        bathrooms: 1,
        regularPrice: 50,
        discountPrice: 50,
        offer: false,
        parking: false,
        furnished: false,
        address: "",
      });
      navigate(`/listing/${data.listing._id}`);
    } catch (error) {
      setError(error.message);
      toast.error("Something went wrong", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Slide,
      });
      setLoading(false);
    }
  };

  const handleImageSubmit = async () => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 5) {
      setUploading(true);
      setImageUploadError(false);
      const fileArray = Array.from(files);

      try {
        // console.log("Uploading images...");
        const urls = await Promise.all(fileArray.map(storeImage));
        console.log("Uploaded URLs:", urls); // Debugging
        setFormData((prevData) => ({
          ...prevData,
          imageUrls: [...prevData.imageUrls, ...urls],
        }));
        setFiles([]);
        setImageUploadError(false);
        setUploading(false);
      } catch (error) {
        setImageUploadError("Image upload failed (2 MB max per image).");
        setUploading(false);
      }
    } else {
      setImageUploadError("You can only upload 4 images per listing");
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      // const fileName = new Date().getTime() + file.name;
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "real_estate"); // Replace with your Cloudinary preset
      formData.append("cloud_name", "dhijdbuqe"); // Replace with your Cloudinary cloud name

      fetch(`https://api.cloudinary.com/v1_1/dhijdbuqe/image/upload`, {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          // console.log("Cloudinary Response:", data); // Debugging
          if (data.secure_url) {
            resolve(data.secure_url);
          } else {
            reject("Image upload failed. No secure URL returned.");
          }
        })
        .catch((err) => {
          console.error("Upload Error:", err);
          reject("Image upload failed due to network or server error.");
        });
    });
  };

  const handleDeleteImage = (url) => {
    setFormData((prevData) => ({
      ...prevData,
      imageUrls: prevData.imageUrls.filter((imageUrl) => imageUrl !== url),
    }));
  };


  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>
      <form
        className="flex flex-col sm:flex-row space-x-5"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg bg-white focus:outline-none border-transparent"
            id="name"
            maxLength="50"
            minLength="6"
            onChange={handleChange}
            value={formData.name}
            required
          />
          <textarea
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg bg-white outline-none border-transparent"
            id="description"
            onChange={handleChange}
            value={formData.description}
            required
          />
          <input
            type="text"
            placeholder="address"
            className="border p-3 rounded-lg bg-white focus:outline-none border-transparent"
            id="address"
            onChange={handleChange}
            value={formData.address}
            required
          />
          <div className=" flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "sale"}
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={formData.parking}
              />
              <span>Parking spot</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={formData.offer}
              />
              <span>Offer</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-4">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                required
                className="p-3 border-gray-300 rounded-lg bg-white focus:outline-none "
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                required
                className="p-3 border-gray-300 rounded-lg bg-white focus:outline-none "
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="number"
                id="regularPrice"
                min="50"
                max="1000000"
                required
                className="p-3 border-gray-300 rounded-lg bg-white focus:outline-none "
                onChange={handleChange}
                value={formData.regularPrice}
              />

              <div className="flex flex-col items-center">
                <p>Regular price </p>
                {formData.type === "rent" && (
                  <span className="text-xs">($ / month)</span>
                )}
              </div>
            </div>
            {formData.offer && (
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  id="discountPrice"
                  min="0"
                  max="1000000"
                  required
                  onChange={handleChange}
                  value={formData.discountPrice}
                  className="p-3 border-gray-300 rounded-lg bg-white focus:outline-none "
                />
                <div className="flex flex-col items-center">
                  <p>Discounted price </p>
                  {formData.type === "rent" && (
                    <span className="text-xs">($ / month)</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover (max 5)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              // onChange={(e) => setFiles(e.target.files)}
              onChange={(e) => setFiles(Array.from(e.target.files))}
              className="p-3 border border-gray-300 rounded w-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button
              type="button"
              onClick={handleImageSubmit}
              disabled={uploading}
              className="p-3 border text-green-700 border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80 cursor-pointer"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          <p className="text-red-700 text-sm">
            {imageUploadError && imageUploadError}
          </p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url) => (
              <div key={url} className="flex justify-between p-3 items-center">
                <img
                  src={url}
                  alt="listing cover"
                  className="w-40 h-40 object-contain rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleDeleteImage(url)}
                  className="p-3 text-red-700 uppercase text-sm hover:opacity-75 cursor-pointer"
                >
                  Delete
                </button>
              </div>
            ))}
          <button
            disabled={loading || uploading}
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80 cursor-pointer"
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
              "Create Listing"
            )}
          </button>
          {error && <p className="text-red-500 text-sm mt-5">{error}</p>}
        </div>
      </form>
    </main>
  );
};

export default CreateListing;
