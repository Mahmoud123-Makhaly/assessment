import { Modal, ModalHeader, ModalBody } from "reactstrap";
interface IModalMakerProps {
  title?: string;
  children?: React.ReactNode;
  isOpen?: boolean;
  toggle?: () => void;
}
function ModalMaker(props: IModalMakerProps) {
  const { title, isOpen, children, toggle } = props;

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <ModalHeader toggle={toggle} className="h4">
        {title}
      </ModalHeader>
      <ModalBody>{children}</ModalBody>
    </Modal>
  );
}

export default ModalMaker;
