import { Link } from 'react-router-dom';
import BlogLayout from '../components/BlogLayout';

export default function NotFound() {
  return (
    <BlogLayout>
      <div className="blog-container">
        <p className="blog-eyebrow">// 404</p>
        <h1 className="blog-heading">Page not found</h1>
        <p className="blog-lede">That page doesn't exist or has moved.</p>
        <p><Link to="/" className="post-back">← Back to home</Link></p>
      </div>
    </BlogLayout>
  );
}
