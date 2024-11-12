import { notFound } from 'next/navigation';
import { getMarkdownFile } from '~/lib/markdown';


export default async function PrivacyPolicy() {
  const post = await getMarkdownFile('legal/privacy');

  if (!post) {
    notFound();
  }

  return (
    <div className="w-11/12 max-w-3xl prose mx-auto p-6 prose-h1:font-heading prose-h2:font-heading prose-h3:font-heading">
      <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
      <div dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
    </div>
  );
}
