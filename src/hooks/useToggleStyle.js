import { useEffect, useState } from "react";

const useToggleStylesheet = (isRTL, isDark) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(false);
    Array.from(document.getElementsByClassName("theme-stylesheet")).forEach(
      (link) => link.remove()
    );
    const link = document.createElement("link");
    link.href = `${process.env.PUBLIC_URL}/css/theme.css`;
    link.type = "text/css";
    link.rel = "stylesheet";
    link.className = "theme-stylesheet";

    const userLink = document.createElement("link");
    userLink.href = `${process.env.PUBLIC_URL}/css/user${
      isRTL ? ".rtl" : ""
    }.css`;
    userLink.type = "text/css";
    userLink.rel = "stylesheet";
    userLink.className = "theme-stylesheet";

    link.onload = () => {
      setIsLoaded(true);
    };

    document.getElementsByTagName("head")[0].appendChild(link);
    document.getElementsByTagName("head")[0].appendChild(userLink);
    document
      .getElementsByTagName("html")[0]
      .setAttribute("dir", isRTL ? "rtl" : "ltr");
  }, [isRTL]);

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-bs-theme",
      isDark ? "dark" : "light"
    );
  }, []);

  return { isLoaded };
};

export default useToggleStylesheet;
