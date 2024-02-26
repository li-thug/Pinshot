import { Row, Col, Image } from "react-bootstrap";
import { MyButton } from "@components";
import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import styles from "./home.module.css";
import {imgs, logo, jayson }  from "@assets";


export default function Home() {
  return (
    <div className="mt-md-5 px-0">
      <div className="d-none d-md-block py-5">
        <h1 className="text-center my-5 display-4 fw-bold">
          See what your friends <br />
          <span style={{ color: "var(--teal100)" }}>are up to</span>
        </h1>
        <Row className="g-3 px-3 justify-content-center">
          {imgs.map((img, i) => (
            <Col key={i} md={4} lg={3}>
              <LazyLoadImage
                effect="blur"
                src={img}
                className="w-100 h-100 rounded-4 object-fit-cover"
                alt="poster-img"
              />
            </Col>
          ))}
        </Row>
      </div>
      <div
        className={`d-md-none d-flex justify-content-center align-items-center ${styles.bgImg}`}
      >
        <div
          className={`${styles.bgDark} position-absolute top-0 w-100 h-100`}
        />
        <div
          className={`${styles.hero} position-absolute top-50 start-50 translate-middle w-100 text-center`}
        >
          <Image src={logo} alt="logo" style={{ width: "180px" }} />
          <h1 className="my-4 text-center text-white fw-bold display-6">
            Post, Like, Comment
          </h1>
          <Link to="/signup">
            <MyButton
              className="border-0 bg-warning text-dark rounded-pill"
              style={{ minWidth: "50%" }}
              text="Sign up"
              size="lg"
            />
          </Link>
          <p className="text-white mt-4 fw-medium">
            Already a member?{" "}
            <Link to="/login">
              <span className="fw-bold">Log in</span>
            </Link>
          </p>
        </div>
      </div>
      <div
        className={`d-md-flex justify-content-center justify-content-md-between align-items-center h-auto ${styles.explore}`}
      >
        <LazyLoadImage
          effect="blur"
          src={jayson}
          alt="unslash Image"
          className={styles.imgAdjust}
        />

        <div className="text-center p-4 w-100">
          <h1
            className="my-4 fw-bold display-5"
            style={{ color: "var(--teal200" }}
          >
            See ideas you like
          </h1>
          <p className="lead" style={{ color: "var(--teal200" }}>
            Browse through our collection of posts, see pictures <br />
            and get inspired for your next big thing.
          </p>
          <Link to="/explore">
            <MyButton
              className={`${styles.btn} border-0 rounded-pill`}
              text="Explore"
              size="lg"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
