// Define the Save component
export default function Save({ attributes }) {
	return (
		// Show the selected post hyperlink
		<p className="dmg-read-more">
			{attributes.linkUrl && attributes.linkText ? (
				<a href={attributes.linkUrl} target="_blank" rel="noopener noreferrer">Read More: {attributes.linkText}</a>
			) : "No post selected."}
		</p>
	);
}
