'use client'
import { ClipboardCheck } from "lucide-react";
import { useRef, useState } from "react";

export default function RssDlg({...props}) {
    const [copyText, setCopyText] = useState('copy');
    const dlg = useRef<HTMLDialogElement>(null);

    function toggleCopyButton() {
        console.log(copyText);
        if (copyText === 'copy') {
          navigator.clipboard.writeText(props.rssLink).then(() => {
            setCopyText('copied');
            setTimeout(() => setCopyText('copy'), 1300);
          });
        } else {
          setCopyText('copy');
        }
    }

    return (        <dialog id="modal_rss"  className="d-modal">
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
          value={props.rssLink}
        />
        <button
          className="d-join-item d-btn d-btn-neural w-28"
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
        <a href={props.rssLink.replace('http:', 'podcast:')} className="d-btn d-btn-primary d-btn-outline" autoFocus>Open in Podcast</a>
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="d-btn">Close</button>
        </form>
      </div>
    </div>
  </dialog>
)
}