import React from "react";
import { Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { faHome } from "@fortawesome/free-solid-svg-icons";

const Error404 = () => {
  return (
    <Card className="text-center">
      <Card.Body className="p-5">
        <div className="display-1 text-300 fs-error">404</div>
        <p className="lead mt-4 text-800 font-sans-serif fw-semibold">
          Aradığınız Sayfa Bulunamadı
        </p>
        <hr />
        <p>
          Adresin doğru olduğuna ve taşınmadığına emin olun. Eğer bir hata
          olduğunu düşünüyorsanız,
          <a href="mailto:info@panteon.com" className="ms-1">
            bize ulaşın.
          </a>
          .
        </p>
        <Link className="btn btn-primary btn-sm mt-3" to="/">
          <FontAwesomeIcon icon={faHome} className="me-2" />
          Ana sayfaya dön
        </Link>
      </Card.Body>
    </Card>
  );
};

export default Error404;
