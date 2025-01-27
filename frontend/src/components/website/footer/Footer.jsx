import { Link } from "react-router-dom";
import "./footer.scss";
import { GiBookAura } from "react-icons/gi";
import { AiOutlineHome, AiOutlineMail, AiOutlinePhone } from "react-icons/ai";

const Footer = () => {
  return (
    <footer className="bg__accent text__color">
      <div className="top">
        <div className="box1">
          <div className="logo text__primary">
            <GiBookAura className="icon" />
            <h4>Siri Vajirārāma Library</h4>
          </div>
          <p style={{ marginTop: "8px", lineHeight: "1.5rem" }}>
          The Siri Vajirarama Library, inaugurated by the most venerable Palane Siri Vajirajanana Mahanayake Thero, 
          a renowned monk of the 20th century, was a repository of knowledge of the venerable monks and scholars of 
          that era who worked to bring Buddhism to the world. It is unquestionably recognized as a globally renowned 
          Sri Lankan Buddhist library.
          </p>
        </div>
        <div className="box2">
          <h4>USEFULL LINKS</h4>
          <Link to="/" className="text__color">
            Home
          </Link>
          <Link to="/about-us" className="text__color">
            About Us
          </Link>
          <Link to="/contact-us" className="text__color">
            Contact Us
          </Link>
          <Link to="/login" className="text__color">
            Login
          </Link>
        </div>

        <div className="box3">
          <h4>OTHER USEFULL LINKS</h4>
          <Link to="/" className="text__color">
            Books
          </Link>
          <Link to="/about-us" className="text__color">
            EBooks
          </Link>
          <Link to="/contact-us" className="text__color">
            Dashboard
          </Link>
          <Link to="/login" className="text__color">
            Forget Password
          </Link>
        </div>

        <div className="box4">
          <h4>CONTACT</h4>
          <div className="item">
            <AiOutlineHome className="icon__home" />
            <span>Vajira Road, Bambalapitiya,Colombo 04, Sri Lanka.</span>
          </div>
          <div className="item">
            <AiOutlineMail className="icon" />
            <span>info@vajirarama.lk</span>
          </div>
          <div className="item">
            <AiOutlinePhone className="icon" />
            <span>+94(0)11 2584202</span>
          </div>
        </div>
      </div>
      <div className="bottom">
        <span>
          &copy;2025 Copyright : Siri Vajiraramaya Colombo 04
        </span>
      </div>
    </footer>
  );
};

export default Footer;
