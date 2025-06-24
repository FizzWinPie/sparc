import Loader from "@/components/Loader";
import React, { createContext, useContext, useState } from "react";

const LoadingContext = createContext({
  isLoading: false,
  setLoading: (value: boolean) => {},
});

export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider = ({ children }: any) => {
  const [isLoading, setLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ isLoading, setLoading }}>
      {children}
      {isLoading && <Loader />}
    </LoadingContext.Provider>
  );
};
