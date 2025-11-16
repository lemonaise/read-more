=== Dmg Read More ===
Contributors:      Sam Thomas
Tags:              block, wp-cli, read more
Tested up to:      6.7
Stable tag:        1.0.0
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

== Description ==

A block for adding a Read More hyperlink to a selected post, and a WP CLI command for searching posts for the Read More block.

== Installation ==

This section describes how to install the plugin and get it working.

1. Upload the plugin files to the `/wp-content/plugins/dmg-read-more` directory, or install the plugin via Upload Plugin, at the top of the WordPress plugins screen.
2. Activate the plugin through the 'Plugins' screen in WordPress

== Screenshots ==

1. When adding the block 'DMG Read More Block' you will see this editor in the Inspector on the right of the screen.

== Instructions ==

= Read More Block =

Add the block to the content, by searching for 'DMG Read More Block'. You will see an editor in the Inspector on the right of the screen. Use this to Search for a post by ID or string. Resulting posts will be listed. Click a post to select, and it will be added to a link in the content.

= Read More Block Search - WP CLI command =

From the command line, enter a command to search the WP database for posts containing the Read More block.

Examples:
  wp dmg-read-more search
  wp dmg-read-more search --date-before=2025-01-01
  wp dmg-read-more search --date-after=2024-01-01
  wp dmg-read-more search --date-after=2024-01-01 --date-before=2025-01-01
