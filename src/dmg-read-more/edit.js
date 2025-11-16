// Import the requiredWordPress components
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, Button } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';
import { useBlockProps } from '@wordpress/block-editor';

// Import the editor.scss file
import './editor.scss';

// Define the number of posts to fetch per page
const POSTS_PER_PAGE = 10;

// Define the Edit component
export default function Edit({ attributes, setAttributes }) {
	// Define the variable and functions for the search, page, posts, total posts, and loading
	const [search, setSearch] = useState('');
	const [page, setPage] = useState(1);
	const [posts, setPosts] = useState([]);
	const [totalPosts, setTotalPosts] = useState(0);
	const [loading, setLoading] = useState(false);

	// Define the block props to be used in the render
	const blockProps = useBlockProps({ className: 'dmg-read-more' });

	// Fetch posts, using the WordPress REST API
	useEffect(() => {
		setLoading(true);
		// Search by ID or title
		if (/^\d+$/.test(search)) {
			// If search is a number, search by post ID to find a single post
			fetch(`/wp-json/wp/v2/posts/${search}`)
				.then(res => {
					// Check if the response is OK (status 200)
					if (res.ok) {
						return res.json();
					} else {
						// Return null for non-existent post
						return null;
					}
				})
				.then(data => {
					setPosts(data ? [data] : []);
					setTotalPosts(data ? 1 : 0);
					setLoading(false);
				});
		} else {
			// If search is not a number, search by title. Paginate the results
			fetch(`/wp-json/wp/v2/posts?per_page=${POSTS_PER_PAGE}&page=${page}&search=${encodeURIComponent(search)}&orderby=date&order=desc`)
				.then(res => {
					setTotalPosts(Number(res.headers.get('X-WP-Total')));
					return res.json();
				})
				.then(data => {
					setPosts(data || []);
					setLoading(false);
				})
				.catch(() => {
					setPosts([]);
					setTotalPosts(0);
					setLoading(false);
				});
		}
	}, [search, page]);

	// Calculate the total number of pages
	const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

	// Render the component
	return (
		<>
			<InspectorControls>
				<PanelBody title="Select Blog Post" initialOpen={true}>
					<TextControl
						label="Search (title or ID)"
						value={search}
						onChange={v => { setPage(1); setSearch(v); }}
						placeholder="Type to find post…"
					/>
					{loading && <p>Loading…</p>}
					{!loading && (
						<div>
							{/* Map the posts to buttons */}
							{posts.map(post => (
								<Button
									key={post.id}
									onClick={() => setAttributes({
										linkText: post.title.rendered,
										linkUrl: post.link
									})}
									className={attributes.linkUrl === post.link ? 'read-more-button post-selected' : 'read-more-button'}
								>
									{post.title.rendered}
								</Button>
							))}
							{/* Show the pagination buttons, if there is more than one page */}
							{totalPosts > POSTS_PER_PAGE && (
								<div style={{ marginTop: 8 }}>
									<Button
										disabled={page === 1}
										onClick={() => setPage(page - 1)}
									>Previous</Button>
									<span style={{ margin: "0 8px" }}>Page {page} of {totalPages}</span>
									<Button
										disabled={page === totalPages}
										onClick={() => setPage(page + 1)}
									>Next</Button>
								</div>
							)}
						</div>
					)}
				</PanelBody>
			</InspectorControls>
			{/* Show the selected post hyperlink */}
			<p {...blockProps}>
				{attributes.linkUrl && attributes.linkText ? (
					<a href={attributes.linkUrl} target="_blank" rel="noopener noreferrer">Read More: {attributes.linkText}</a>
				) : "Select a post in the block settings on the right."}
			</p>
		</>
	);
}
