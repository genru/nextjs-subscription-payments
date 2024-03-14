'use client'
import { Music4 } from "lucide-react";
import { useRouter } from "next/navigation";
import { BaseSyntheticEvent, useState } from "react";

export default function NavbarAction({...props}) {
    function toggleNewModal(e: BaseSyntheticEvent) {
        // console.info(e);
        const modal = document.querySelector('#modal_new');
        // @ts-ignore
        modal?.showModal();
    }

    function onSubmit(e:React.FormEvent<HTMLFormElement>) {
        const formdata = new FormData(e.currentTarget);
        const submitEvent: SubmitEvent = e.nativeEvent as SubmitEvent;
        if(submitEvent?.submitter?.dataset['role'] !== 'close') {
            props.onSubmit(e);
        }
    }

    return (
        <div className="d-navbar h-4 min-h-8 mb-4">
            <div className="flex-1">
                <h2 className="text-2xl">{props.title}</h2>
            </div>
            <div className="flex-none">
            <ul className="d-menu d-menu-horizontal d-rounded-box">
                <li className="d-tooltip" data-tip="add new feeds">
                    <button className="d-btn-ghost d-btn d-btn-sm" onClick={toggleNewModal}>
                        <Music4 width={18} height={18}/>
                        New
                    </button>
                </li>
            </ul>
            </div>
            <Dialog onSubmit={onSubmit}/>

        </div>
    )
}

function Dialog({...props}) {
    return (
        <dialog id="modal_new" className="d-modal">
            <div className="d-modal-box bg-base-100">
            <h3 className="font-bold text-lg"> Create new feed from youtube playlist</h3>
            <p className="py-4 text-secondary-content">
                Paste youtube video url here
            </p>
            <form id="urlForm"  onSubmit={props.onSubmit} method="dialog">
                <input
                className="d-input d-input-bordered w-96 z-0"
                placeholder="https://youtube.com/watch?v=xxxx"
                type="text"
                name="url"
                />
            </form>
                <div className="d-modal-action">
                {/* if there is a button in form, it will close the modal */}
                <button
                    form='urlForm'
                    type='submit'
                    className="d-btn d-btn-accent text-accent-content"
                >
                    Save
                </button>
                <button form='urlForm'type='submit' className='d-btn d-btn-neutral d-btn-outline' data-role="close">Close</button>
                </div>
            {/* </form> */}
            </div>
        </dialog>

    );
}