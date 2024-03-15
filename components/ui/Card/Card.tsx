import { ReactNode } from 'react';

interface Props {
  title: string;
  subscription?: string|null;
  description?: string;
  footer?: ReactNode;
  children: ReactNode;
}

export default function Card({ title, subscription, description, footer, children }: Props) {
  return (
    <div className="w-full max-w-3xl m-auto my-8 border rounded-md p border-zinc-700">
      <div className="px-5 py-4">
        <h3 className="mb-1 text-2xl font-medium">{title}</h3>
        {subscription ? <p className="">You are currently on the <span className='d-badge d-badge-primary'>{subscription}</span> plan.</p>:<p className="">{description}</p>}

        {children}
      </div>
      {footer && (
        <div className="p-4 border-t rounded-b-md border-zinc-700 bg-base-300">
          {footer}
        </div>
      )}
    </div>
  );
}
