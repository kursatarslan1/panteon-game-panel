import Divider from "components/common/Divider";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import AuthServices from "services/AuthServices";
import { useNavigate } from "react-router-dom";

const LoginForm = ({ hasLabel }) => {
  const navigate = useNavigate();
  const [waitLogin, setWaitLogin] = useState(false);

  // State
  const [formData, setFormData] = useState({
    id: 0,
    username: "",
    password: "",
    email: "",
  });
  let userInfo;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setWaitLogin(true);
      const response = await AuthServices.login(formData);
      const token = response.token;
      if (token) {
        localStorage.setItem("token", response.token);

        userInfo = await AuthServices.userinfo(token);
        if (!userInfo) {
          navigate("authentication/simple/login");
          return;
        }

        localStorage.setItem("username", userInfo.username);

        toast.success(`Kullanıcı ${userInfo.username} başarıyla giriş yaptı.`);
        navigate("/");
        setWaitLogin(false);
      } else {
        toast.error("Kullanıcı adı veya şifre hatalı");
      }
    } catch (error) {
      console.error("Kullanıcı giriş yapamadı.", error);
      toast.error("Kullanıcı giriş yapamadı.");
      setWaitLogin(false);
    } finally {
      setWaitLogin(false);
    }
  };

  const handleFieldChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        {hasLabel && <Form.Label>Kullanıcı adı</Form.Label>}
        <Form.Control
          placeholder={!hasLabel ? "Kullanıcı adı" : ""}
          value={formData.username}
          name="username"
          onChange={handleFieldChange}
          type="text"
        />
      </Form.Group>

      <Form.Group className="mb-3">
        {hasLabel && <Form.Label>Şifre</Form.Label>}
        <Form.Control
          placeholder={!hasLabel ? "Şifre" : ""}
          value={formData.password}
          name="password"
          onChange={handleFieldChange}
          type="password"
        />
      </Form.Group>

      <Form.Group>
        <Button
          type="submit"
          color="primary"
          variant="warning"
          className="mt-3 w-100"
          disabled={!formData.username || !formData.password || waitLogin}
        >
          {waitLogin ? "Giriş Yapılıyor..." : "Giriş Yap"}
        </Button>
      </Form.Group>

      <Divider className="mt-4 mb-4 text-warning">Veya Hemen Kayıt Ol</Divider>

      <p className="fs-10 text-600 mb-0 text-center text-warning">
        <Link to="/authentication/simple/register" className="text-warning">
          Hesap Oluştur
        </Link>
      </p>
    </Form>
  );
};

LoginForm.propTypes = {
  layout: PropTypes.string,
  hasLabel: PropTypes.bool,
};

LoginForm.defaultProps = {
  layout: "simple",
  hasLabel: false,
};

export default LoginForm;
