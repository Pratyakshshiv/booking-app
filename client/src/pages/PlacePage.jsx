import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import BookingWidget from "../components/BookingWidget";
import PlaceGallery from "../components/PlaceGallery";
import AddressLink from "../components/AddressLink";
import { UserContext } from "../UserContext";

const PlacePage = () => {
  const { user } = useContext(UserContext);
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [like, setLike] = useState(false);
  const [redirect, setRedirect] = useState("");

  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get(`/places/${id}`).then((response) => {
      setPlace(response.data);
    });
  }, [id]);

  useEffect(() => {
    async function fetchData() {
      if (!user) {
        return "";
      }
      const { data } = await axios.get("/check-liked");
      for (let index = 0; index < data.length; index++) {
        if (data[index] === id) {
          setLike(true);
          break;
        }
      }
    }
    if (user) {
      fetchData();
    }
  }, []);

  const likeThisPlace = async (ev) => {
    ev.preventDefault();
    if (!user) {
      alert("login first");
      setRedirect("/login");
      return <Navigate to={redirect} />;
    }
    const { data } = await axios.get("/check-liked");
    let likedPlaces = data;
    if (like) {
      likedPlaces = [...likedPlaces.filter((index) => index !== id)];
      setLike(false);
    } else {
      setLike(true);
      likedPlaces = [...likedPlaces, id];
    }
    axios.put("/set-liked", likedPlaces);
  };

  if (!place) return "";

  return (
    <div className="mt-4 pt-8 bg-gray-100 -mx-8 pl-20 pr-20">
      <h1 className="text-3xl">{place.title}</h1>
      <div className="flex">
        <button
          onClick={(ev) => likeThisPlace(ev)}
          className="bg-inherit pt-2 pl-5 pr-3"
        >
          {like && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-8 h-8 text-primary"
            >
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
          )}
          {!like && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
          )}
        </button>
        <div className="mt-0.5">
          <AddressLink>{place.address}</AddressLink>
        </div>
      </div>
      <PlaceGallery place={place} />
      <div className="mt-8 mb-8 gap-8 grid grid-cols-1 md:grid-cols-[2fr_1fr]">
        <div>
          <div className="my-4">
            <h2 className="font-semibold text-2xl">Description</h2>
            {place.description}
          </div>
          Check-in: {place.checkIn}
          <br />
          Check-out: {place.checkOut}
          <br />
          Max number of guests: {place.maxGuests}
        </div>
        <div>
          <BookingWidget place={place} />
        </div>
      </div>
      <div className="bg-white -mx-8 px-8 py-8 border-t">
        <div>
          <h2 className="font-semibold text-2xl">Extra Info</h2>
        </div>
        <div className="text-sm text-gray-700 leading-5 mb-4 mt-2">
          {place.extraInfo}
        </div>
      </div>
    </div>
  );
};

export default PlacePage;
