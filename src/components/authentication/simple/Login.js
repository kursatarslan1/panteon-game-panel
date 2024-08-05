import React from "react";
import LoginForm from "components/authentication/LoginForm";
import PropTypes from "prop-types";

const Login = () => {
  return (
    <>
      <h5 className="text-warning">Giriş Yap</h5>
      <LoginForm />
    </>
  );
};

LoginForm.propTypes = {
  isManager: PropTypes.bool.isRequired,
};

export default Login;
