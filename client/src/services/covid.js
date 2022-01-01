import Axios from "axios";

const services = {
  getAPICovidCountry: () => {
    const response = Axios.get("https://api.covid19api.com/countries");
    return response;
  },
  getAPIReportByCountry: (country) => {
    const response = Axios.get(
      `https://api.covid19api.com/total/dayone/country/${country}`,
    );
    return response;
  },
};

export default services;
