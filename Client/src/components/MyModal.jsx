import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import { IoClose } from "react-icons/io5";

export default function MyModal({
  show,
  handleClose,
  title,
  children,
  ...props
}) {
  return (
    <Modal show={show} onHide={handleClose} centered {...props}>
      <Modal.Header>
        <Modal.Title>{title}</Modal.Title>
        <IoClose size="20px" onClick={handleClose} className="cursor" />
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
    </Modal>
  );
}

MyModal.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  handleClose: PropTypes.func,
  show: PropTypes.bool,
  props: PropTypes.any,
};