import { Link } from 'react-router-dom';
import { formatDate } from '../blog/posts';

export default function RecentBlogs({ posts }) {
  const recentPosts = posts.slice(0, 3);

  return (
    <section id="recent-blogs" className="section recent-blogs-section" aria-labelledby="recent-blogs-title">
      <div className="section-content">
        <div className="section-label">
          <span className="label-number">06</span>
          <span className="label-text">Writing</span>
        </div>

        <div className="recent-blogs-heading">
          <div>
            <h2 className="section-title" id="recent-blogs-title">Recent blogs</h2>
            <p className="recent-blogs-lede">
              Notes from things I’m building, learning, and figuring out along the way.
            </p>
          </div>
          <Link to="/blog/" className="recent-blogs-all">
            Browse all stories <span aria-hidden="true">↗</span>
          </Link>
        </div>

        {recentPosts.length > 0 ? (
          <div className="recent-blogs-grid">
            {recentPosts.map((post) => (
              <Link key={post.slug} to={`/blog/${post.slug}/`} className="recent-blog-card">
                <div className="post-card-meta">
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                  <span aria-hidden="true">·</span>
                  <span>{post.readingTime} min read</span>
                  {post.draft && <span className="post-draft">draft</span>}
                </div>
                <h3>{post.title}</h3>
                <p>{post.description}</p>
                {post.tags.length > 0 && (
                  <div className="post-tags">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="post-tag">{tag}</span>
                    ))}
                  </div>
                )}
                <span className="recent-blog-cta">Read the story <span aria-hidden="true">→</span></span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="recent-blogs-empty">
            <span className="recent-blogs-empty-icon" aria-hidden="true">✎</span>
            <div>
              <h3>Fresh notes are brewing</h3>
              <p>New write-ups are on the way. Check back soon for stories from my latest builds.</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
