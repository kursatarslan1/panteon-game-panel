import React from "react";
import PropTypes from "prop-types";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import logoutImg from "assets/img/icons/spot-illustrations/45.png";

const LogoutContent = ({ layout, titleTag: TitleTag }) => {
  return (
    <>
      <img
        className="d-block mx-auto mb-4"
        src={logoutImg}
        alt="shield"
        width={100}
      />
      <TitleTag>Tekrar Görüşmek Üzere!</TitleTag>
      <p>
        PANTEON'u kullandığınız için teşekkürler. Şuan{" "}
        <br className="d-none d-sm-block" />
        başarıyla çıkış yaptınız.
      </p>
      <Button
        as={Link}
        color="primary"
        size="sm"
        className="mt-3"
        to={`/authentication/${layout}/login`}
      >
        <FontAwesomeIcon
          icon="chevron-left"
          transform="shrink-4 down-1"
          className="me-1"
        />
        Giriş Ekranına Dön
      </Button>
    </>
  );
};

LogoutContent.propTypes = {
  layout: PropTypes.string,
  titleTag: PropTypes.string,
};

LogoutContent.defaultProps = {
  layout: "simple",
  titleTag: "h4",
};

export default LogoutContent;
