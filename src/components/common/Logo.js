import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Link } from "react-router-dom";
import logo from "assets/img/illustrations/only_logo.png";

const Logo = ({ at, width, className, textClass, ...rest }) => {
  return (
    <Link
      to="/"
      className={classNames(
        "text-decoration-none",
        { "navbar-brand text-left": at === "navbar-vertical" },
        { "navbar-brand text-left": at === "navbar-top" }
      )}
      {...rest}
    >
      <div
        className={classNames(
          "d-flex",
          {
            "align-items-center py-3": at === "navbar-vertical",
            "align-items-center": at === "navbar-top",
            "flex-center fw-bolder fs-4 mb-4": at === "auth",
          },
          className
        )}
      >
        <img className="me-2" src={logo} alt="Logo" width={width} />
        <span className={classNames("font-sans-serif text-warning", textClass)}>
          Panteon
        </span>
      </div>
    </Link>
  );
};

Logo.propTypes = {
  at: PropTypes.oneOf(["navbar-vertical", "navbar-top", "auth"]),
  width: PropTypes.number,
  className: PropTypes.string,
  textClass: PropTypes.string,
};

Logo.defaultProps = { at: "auth", width: 58 };

export default Logo;
