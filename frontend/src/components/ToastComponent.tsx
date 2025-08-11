import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ToastComponentProps {
  position?: "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right";
  autoClose?: number | false;
  hideProgressBar?: boolean;
  newestOnTop?: boolean;
  closeOnClick?: boolean;
  rtl?: boolean;
  pauseOnFocusLoss?: boolean;
  draggable?: boolean;
  pauseOnHover?: boolean;
  theme?: "light" | "dark" | "colored";
}

const ToastComponent: React.FC<ToastComponentProps> = ({
  position = "top-center",
  autoClose = 5000,
  hideProgressBar = false,
  newestOnTop = false,
  closeOnClick = true,
  rtl = false,
  pauseOnFocusLoss = true,
  draggable = true,
  pauseOnHover = true,
  theme = "light",
}) => {
  return (
    <ToastContainer
      position={position}
      autoClose={autoClose}
      hideProgressBar={hideProgressBar}
      newestOnTop={newestOnTop}
      closeOnClick={closeOnClick}
      rtl={rtl}
      pauseOnFocusLoss={pauseOnFocusLoss}
      draggable={draggable}
      pauseOnHover={pauseOnHover}
      theme={theme}
    />
  );
};

export default ToastComponent;
