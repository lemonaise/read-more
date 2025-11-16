import { registerBlockType } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import Edit from './edit';
import save from './save';
import metadata from './block.json';

// Register the block type
registerBlockType(metadata.name, {
	// Define the attributes for the block
	attributes: {
		// Define the link URL attribute
		linkUrl: {
			type: 'string',
			default: ''
		},
		linkText: {
			type: 'string',
			default: ''
		}
	},

	// Define the edit component
	edit: Edit,

	// Define the save component
	save,
});
