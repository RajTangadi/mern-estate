import { useEffect, useState } from "react";
import { Oval } from "react-loader-spinner";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";

const Listing = () => {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const params = useParams();
  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.id}`);
        const data = await res.json();
        if (data.success === false) {
          console.log(data.message);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setLoading(false);
        setError(true);
      }
    };

    fetchListing();
  }, [params.id]);

  console.log(listing);

  return (
    <main>
      {loading && (
        <div className="text-center my-7 text-2xl">
          <Oval
            visible={true}
            height="40"
            width="40"
            color="#fff"
            strokeWidth={5}
            ariaLabel="oval-loading"
            wrapperStyle={{ display: "flex", justifyContent: "center" }}
            wrapperClass=""
          />
        </div>
      )}
      {error && <p className="text-center text-2xl">An error occurred</p>}
      {listing && !loading && !error && (
        <Swiper navigation>
          {listing.imageUrls.map((url) => (
            <SwiperSlide key={url}>
              <div
                className="h-[550px]"
                style={{
                  background: `url(${url}) center no-repeat`,
                  backgroundSize: "cover",
                }}
              ></div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </main>
  );
};

export default Listing;
