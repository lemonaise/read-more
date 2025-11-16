<?php
/**
 * Plugin Name:       Dmg Read More
 * Description:       A block for adding a Read More hyperlink to a selected post, and a WP-CLI command for searching for instances of the Read More block.
 * Version:           1..0
 * Requires at least: 6.7
 * Requires PHP:      7.4
 * Author:            Sam Thomas
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       dmg-read-more
 *
 * @package CreateBlock
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}
/**
 * Registers the block using a `blocks-manifest.php` file, which improves the performance of block type registration.
 * Behind the scenes, it also registers all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://make.wordpress.org/core/2025/03/13/more-efficient-block-type-registration-in-6-8/
 * @see https://make.wordpress.org/core/2024/10/17/new-block-type-registration-apis-to-improve-performance-in-wordpress-6-7/
 */

 
// Register the Read More block
function create_block_dmg_read_more_block_init() {
	// Register the block type from the blocks-manifest.php file
	if ( function_exists( 'wp_register_block_types_from_metadata_collection' ) ) {
		wp_register_block_types_from_metadata_collection( __DIR__ . '/build', __DIR__ . '/build/blocks-manifest.php' );
		return;
	}
	if ( function_exists( 'wp_register_block_metadata_collection' ) ) {
		wp_register_block_metadata_collection( __DIR__ . '/build', __DIR__ . '/build/blocks-manifest.php' );
	}
	$manifest_data = require __DIR__ . '/build/blocks-manifest.php';
	foreach ( array_keys( $manifest_data ) as $block_type ) {
		register_block_type( __DIR__ . "/build/{$block_type}" );
	}
}
add_action( 'init', 'create_block_dmg_read_more_block_init' );

// Add a WP-CLI command to search for instances of the Read More block
if ( defined( 'WP_CLI' ) && WP_CLI ) {
    class Dmg_Read_More_CLI_Command {
        /**
         * Search for posts containing the dmg-read-more block.
         *
         * ## OPTIONS
         *
         * [--date-before=<date>]
         * : Only show posts published before this date (YYYY-MM-DD).
         *
         * [--date-after=<date>]
         * : Only show posts published after this date (YYYY-MM-DD).
         *
         * ## EXAMPLES
         *
         *     wp dmg-read-more search
         *     wp dmg-read-more search --date-before=2025-01-01
         *     wp dmg-read-more search --date-after=2024-01-01
         *     wp dmg-read-more search --date-after=2024-01-01 --date-before=2025-01-01
         */
        public function search( $args, $assoc_args ) {
            $date_before = $assoc_args['date-before'] ?? '';
            $date_after = $assoc_args['date-after'] ?? '';

            // Set default date range to last 30 days if no filters provided
            if ( empty( $date_before ) && empty( $date_after ) ) {
                $date_after = date( 'Y-m-d', strtotime( '-30 days' ) );
            }

						// Build the arguments for the query
            $args = [
                'post_type'      => 'any',
                'post_status'    => 'publish',
                's'              => '<!-- wp:dmg/read-more-block',
                'posts_per_page' => -1,
            ];

						// Add the date filters if provided
            if ( $date_after ) {
                $args['date_query'][] = [
                    'after'     => $date_after,
                    'inclusive' => true,
                ];
            }
            if ( $date_before ) {
                $args['date_query'][] = [
                    'before'    => $date_before,
                    'inclusive' => true,
                ];
            }

						// Execute the WP query
						$query = new WP_Query( $args );
            $posts = $query->posts;

						if ( empty( $posts ) ) {
                WP_CLI::warning( 'No matching posts found.' );
                return;
            }

						// Get the results
						$rows = array_map( function( $post ) {
								return [
										'ID' => $post->ID,
										'Title' => $post->post_title,
										'Date' => $post->post_date,
										'URL' => get_permalink( $post->ID )
								];
						}, $posts );

						// Format the results as a table and output to screen
						WP_CLI\Utils\format_items( 'table', $rows, [ 'ID', 'Title', 'Date', 'URL' ] );
        }
    }

    WP_CLI::add_command( 'dmg-read-more', 'Dmg_Read_More_CLI_Command' );
}
