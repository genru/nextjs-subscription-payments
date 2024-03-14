'use client';
import { handleRequest } from '@/utils/auth-helpers/client';
import { addEpisodeByYoutube } from '@/utils/rss/server';
import { Play, Shuffle, ClipboardCheck, Music, Podcast, RefreshCw, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function FeedInfo({ ...props }) {
  const [copyText, setCopyText] = useState('copy');
  const [showNewModal, setShowNewModal] = useState(false);
  const router = useRouter();
  function showRssModal() {
    const modal = document.querySelector('#modal_rss');
    // @ts-ignore
    modal?.showModal();
  }

  function toggleNewModal() {
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

  async function createNew(e: React.FormEvent<HTMLFormElement>) {
    const formdata = new FormData(e.currentTarget);
    const submitEvent: SubmitEvent = e.nativeEvent as SubmitEvent;
    console.log(submitEvent?.submitter?.dataset['role']);
    if(submitEvent?.submitter?.dataset['role'] !== 'close') {
        console.info(e, formdata.get('url'))
        await handleRequest(e, addEpisodeByYoutube, router);
    }
  }

  function feedMenuItems() {
    return (
        <>
        <li><a><RefreshCw width={16} height={16} />Refresh</a></li>
        <li><button className='text-error' onClick={() => console.info('remove clicked')}><Trash2 width={16} height={16} />Remove</button></li>
        </>
    )
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
                    {/* <h2 className="d-card-title font-medium">{props.title}</h2> */}
                    <NavbarAction title={props.title} menuItems={feedMenuItems()} />
                    <p className="text-xs">{props.author}</p>
                    <div className="d-card-actions mt-4 justify-center flex flex-row">
                    <button
                        className="d-btn d-btn-sm h-10 d-btn-neutral flex-grow-1 w-2/5"
                        onClick={showRssModal}
                    >

                        <Podcast width={16} height={16} /> RSS
                    </button>
                    <button
                        className="d-btn d-btn-sm h-10 d-btn-neutral flex-grow-1 w-2/5"
                        onClick={toggleNewModal}
                    >

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
            <form method="dialog">
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
          <form id="urlForm"  onSubmit={createNew} method="dialog">
            <input type="hidden" name="feed_id" value={props.feed.uuid} />
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
    </>
  );
}

function NavbarAction({...props}) {
    return (
        <div className="d-navbar bg-base-100">
            <div className="flex-1">
                <h2 className="text-xl font-semibold">{props.title}</h2>
            </div>
            <div className="flex-none">
                <div className="d-dropdown d-dropdown-end">
                    <div tabIndex={0} role="button" className="d-btn  d-btn-xs d-btn-square d-btn-ghost m-1">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path></svg>
                    </div>
                    <ul tabIndex={0} className="d-dropdown-content z-[1] d-menu p-2 shadow bg-base-100 rounded-box w-32">
                        {props.menuItems}
                    </ul>
                </div>
            </div>
        </div>
    )
}