import { useEffect, useRef, useState } from "react";
import './Modal.css';

function Modal({openModal, closeModal, children}) {
    const ref = useRef();
    const [show, setShow] = useState(false);
    useEffect(() => {
        if(openModal) {
            setShow(true);
            ref.current?.showModal();
        } else {
            setShow(false);
            ref.current?.close();
        }
    }, [openModal]);

    const handleClose = () => {
        closeModal();
    }
    return (
        <div className={show ? "modal-container flex flex-col items-center w-full h-full justify-center mx-auto lg:py-0 lg:m-auto relative" : "hidden"}>
            <dialog className='w-[800px] bg-white rounded-lg shadow dark:border px-4 py-3 cursor-auto  m-auto dark:bg-gray-800 dark:border-gray-700 lg:m-auto' ref={ref} onCancel={closeModal}>
                {children}
            </dialog>
        </div>  
    );
}

export default Modal;