import { Link } from 'react-router-dom';

function PageFooter({ text, linkTo, linkLabel }) {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <p>{text}</p>
        <Link to={linkTo}>{linkLabel}</Link>
      </div>
    </footer>
  );
}

export default PageFooter;
