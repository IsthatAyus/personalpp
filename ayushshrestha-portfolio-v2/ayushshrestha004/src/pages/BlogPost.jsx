import { Link, useParams } from 'react-router-dom';
import BlogLayout from '../components/BlogLayout';
import NotFound from './NotFound';
import { getPost, formatDate } from '../blog/posts';
import profilePhoto from '../assets/ayush-shrestha.jpeg';

export default function BlogPost() {
  const { slug } = useParams();
  const post = getPost(slug);
  if (!post) return <NotFound />;

  return (
    <BlogLayout>
      <article className="blog-container blog-post-page">
        <div className="post-topline">
          <Link to="/blog/" className="post-back"><span aria-hidden="true">←</span> All stories</Link>
          <span className="post-kicker"><span aria-hidden="true">✦</span> A FIELD NOTE</span>
        </div>

        <header className="post-header">
          <div className="post-card-meta">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span>·</span>
            <span><span aria-hidden="true">◷ </span>{post.readingTime} min read</span>
            {post.draft && <span className="post-draft">draft</span>}
          </div>
          <h1 className="post-title">{post.title}</h1>
          <p className="post-summary">{post.description}</p>
          {post.updated && (
            <p className="post-updated">
              Updated <time dateTime={post.updated}>{formatDate(post.updated)}</time>
            </p>
          )}
          {post.tags.length > 0 && (
            <div className="post-tags">
              {post.tags.map((t) => (
                <span key={t} className="post-tag">{t}</span>
              ))}
            </div>
          )}
        </header>

        {post.image && (
          <figure className="post-cover">
            <img src={post.image} alt={post.title} />
          </figure>
        )}

        <div className="post-reading-column">
          <div className="prose" dangerouslySetInnerHTML={{ __html: post.html }} />

          <aside className="post-author">
            <img src={profilePhoto} alt="" />
            <div className="post-author-content">
              <p className="post-author-kicker">A LITTLE ABOUT THE AUTHOR</p>
              <p>
                <strong>Ayush Shrestha</strong> is a DevOps engineer and full-stack developer
                from Kathmandu, Nepal. Curious about the person behind the posts?
              </p>
              <div className="post-author-links">
                <Link to="/#about">More about me <span aria-hidden="true">↗</span></Link>
                <Link to="/#projects">See my projects <span aria-hidden="true">↗</span></Link>
              </div>
            </div>
          </aside>

          <div className="post-next-reading">
            <span className="post-next-icon" aria-hidden="true">✦</span>
            <div>
              <p>That’s the end of this note.</p>
              <Link to="/blog/">Find another story <span aria-hidden="true">→</span></Link>
            </div>
          </div>
        </div>
      </article>
    </BlogLayout>
  );
}
