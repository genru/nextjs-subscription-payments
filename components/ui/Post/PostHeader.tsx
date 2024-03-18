import { PostTitle } from "./PostTile";

type Props = {
    title: string;
    date: string;
  };

  export function PostHeader({ title, date }: Props) {
    return (
      <>
        <PostTitle>{title}</PostTitle>
        <div className="max-w-2xl mx-auto">
          <div className="mb-6 text-lg">
          </div>
        </div>
      </>
    );
  }