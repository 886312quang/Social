import { useState, useEffect } from "react";
import api from "../api/api";
import { useDispatch } from "react-redux";
import contactActions from "../store/_actions/contact";

const useFetch = () => {
  const dispatch = useDispatch();

  const [data, setData] = useState({
    slug: "",
    results: [],
  });

  useEffect(() => {
    if (data.slug !== "") {
      const timeoutId = setTimeout(() => {
        dispatch(contactActions.findUserContacts(data.slug));
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [data.slug]);

  return { data, setData };
};

export default useFetch;
