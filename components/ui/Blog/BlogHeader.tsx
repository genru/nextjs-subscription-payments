import { BlogTitle } from "./BlogTile";

type Props = {
    title: string;
    date: string;
  };

  export function BlogHeader({ title, date }: Props) {
    return (
      <>
        <BlogTitle>{title}</BlogTitle>
        <div className="max-w-2xl mx-auto">
          <div className="mb-6 text-lg">
          </div>
        </div>
      </>
    );
  }