import React, { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import AuthServices from "services/AuthServices";
import { useNavigate } from "react-router-dom";

const Registration = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = {
        username,
        email,
        password,
      };

      const response = await AuthServices.register(data);
      if (!response || !response.token) {
        toast.error("Kayıt işlemi sırasında bir hata oluştu.");
      } else {
        toast.success("Kayıt Başarılı");
        localStorage.setItem("token", response.token);
        const userInfo = await AuthServices.userinfo(response.token);
        if (!userInfo.username) {
          return;
        } else {
          localStorage.setItem("username", userInfo.username);
          toast.success("Giriş Başarılı");
          navigate("/");
        }
      }
    } catch (error) {
      toast.error("Kayıt olma işlemi başarısız.");
    }
  };

  return (
    <>
      <Row className="align-items-center mb-2" md={12} xl={12}>
        <Col>
          <h5 id="modalLabel">Kayıt Ol</h5>
        </Col>
        <Col xs="auto">
          <p className="fs-10 text-600 mb-0">
            Hesabın var mı?{" "}
            <Link to="/authentication/simple/login">Giriş Yap</Link>
          </p>
        </Col>
      </Row>
      <Form>
        <Form.Label>Kullanıcı adı:</Form.Label>
        <Form.Control
          type="text"
          name="username"
          onChange={(e) => setUsername(e.target.value)}
        ></Form.Control>
        <Form.Label>Email:</Form.Label>
        <Form.Control
          type="mail"
          name="email"
          onChange={(e) => setEmail(e.target.value)}
        ></Form.Control>
        <Form.Label>Şifre:</Form.Label>
        <Form.Control
          type="password"
          name="password"
          onChange={(e) => setPassword(e.target.value)}
        ></Form.Control>
        <Button variant="primary w-100 mt-2" onClick={handleSubmit}>
          Kayıt Ol
        </Button>
      </Form>
    </>
  );
};

export default Registration;
