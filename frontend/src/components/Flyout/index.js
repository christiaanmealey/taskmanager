import { useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";

function Flyout({children, title, openFlyout, closeFlyout, inModal}) {    
    const [isOpen, setIsOpen] = useState(false);
    const [content, setContent] = useState(null);

    useEffect(() => {
        if(openFlyout) {
            setIsOpen(true);
            setContent(children);
        } else {
            setIsOpen(false);
            setContent(null);
        }
    }, [openFlyout]);

    return (
        <div className={!isOpen ? 'hidden' : `bg-white min-w-[300px] rounded-lg z-[9999] text-gray-900 drop-shadow-lg border border-gray-200 ${inModal ? 'fixed' : 'absolute'}`}>
            <div className="flex justify-between items-center px-2 pt-1">
                <p className="flex-grow text-center">{title}</p>
                <button onClick={() => closeFlyout()}>
                    <XMarkIcon className="size-5 mr-1" />
                </button>
            </div>
            <div className="content p-2">
                {content}
            </div>
        </div>
    )
}

export default Flyout;