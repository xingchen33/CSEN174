# Architecture
We REALLY want a separation of UI and backend code.
This was not the case in the past. Most of the UI code has been fully deleted. You can check out the older versions on GitHub to recover this.

Backend classes are for DATA ONLY. UI does not need to be included in them, and should not be since it makes it easier to test them.

Also, we should have some native HTML structure; the game looks mostly static, so defining a few elements and adding to them should work fine.
