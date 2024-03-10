'use client';
import { Play, Shuffle, ClipboardCheck, Music, Podcast } from 'lucide-react';
import { useState } from 'react';

export function FeedInfo({ ...props }) {
  const [copyText, setCopyText] = useState('copy');
  function showRssModal() {
    const modal = document.querySelector('#modal_rss');
    // @ts-ignore
    modal?.showModal();
  }

  function showNewModal() {
    const modal = document.querySelector('#modal_new');
    // @ts-ignore
    modal?.showModal();
  }

  function toggleCopyButton() {
    console.log(copyText);
    if (copyText === 'copy') {
      navigator.clipboard.writeText(props.rss).then(() => {
        setCopyText('copied');
        setTimeout(() => setCopyText('copy'), 1300);
      });
    } else {
      setCopyText('copy');
    }
  }

  function createNew(e: React.FormEvent<HTMLFormElement>) {
    const formdata = new FormData(e.currentTarget);
    console.info(e, formdata)
    // e.preventDefault();
  }
  return (
    <>
      <div
        className="w-96 h-full mt-4 flex-shrink-0 overflow-y-auto overflow-x-hidden transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidenav"
      >
        <div className='top-0 left-0 w-full h-full'>
            {/* <img src={props.cover}></img> */}
            <div className="d-card d-card-bordered border-base-300 w-96 bg-base-100 shadow-sm rounded-sm">
                <figure className='p-0 rounded-md '>
                    <img
                    src={
                        props.cover ||
                        'https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg'
                    }
                    alt={props.title || undefined}
                    />
                </figure>
                <div className="d-card-body">
                    <h2 className="d-card-title font-medium">{props.title}</h2>
                    <p className="text-xs">{props.author}</p>
                    <div className="d-card-actions mt-4 justify-center flex flex-row">
                    <button
                        className="d-btn d-btn-sm h-10 d-btn-neutral flex-grow-1 w-2/5"
                        onClick={showRssModal}
                    >
                        {' '}
                        <Podcast width={16} height={16} /> RSS
                    </button>
                    <button
                        className="d-btn d-btn-sm h-10 d-btn-neutral flex-grow-1 w-2/5"
                        onClick={showNewModal}
                    >
                        {' '}
                        <Music width={16} height={16} /> Add
                    </button>
                    </div>
                    <p className="text-neural py-8">{props.description}</p>
                </div>
            </div>
        </div>
      </div>

      <dialog id="modal_rss" className="d-modal">
        <div className="d-modal-box bg-base-100">
          <h3 className="font-bold text-lg"> Podcast(iTunes) rss url</h3>
          <p className="py-4 text-secondary-content">
            open your podcast or iTunes and import below url
          </p>
          <div className="d-join">
            <input
              className="d-join-item d-input d-input-bordered d-input-primary w-80"
              disabled
              placeholder="rss"
              value={props.rss}
            />
            <button
              className="d-join-item d-btn d-btn-neural w-32"
              onClick={toggleCopyButton}
            >
              {copyText == 'copied' && (
                <ClipboardCheck
                  width={22}
                  height={22}
                  className="text-success"
                />
              )}
              {copyText}
            </button>
          </div>
          <div className="d-modal-action">
            <form method="d-dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="d-btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>

      <dialog id="modal_new" className="d-modal">
        <div className="d-modal-box bg-base-100">
          <h3 className="font-bold text-lg"> Podcast(iTunes) rss url</h3>
          <p className="py-4 text-secondary-content">
            open your podcast or iTunes and import below url
          </p>
          <form id="urlForm" onSubmit={createNew}>
            <input
              className="d-join-item d-input d-input-bordered d-input-primary w-96"
              placeholder="https://youtube.com/watch?v=xxxx"
              type="url"
              name='url'
            />
            <div className="d-modal-action">
              {/* if there is a button in form, it will close the modal */}
              <button
                form='urlForm'
                type="submit"
                className="d-btn d-btn-accent text-accent-content"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
}
