(function anonymizedradios() {
  const { Platform, URI } = Spicetify;

  async function makePlaylist(uris) {
    let trackID = uris[0];
    
    // Convert to radio
    let convReq = await Spicetify.CosmosAsync.get(`https://spclient.wg.spotify.com/inspiredby-mix/v2/seed_to_playlist/${trackID}?response-format=json`);
    
    if (!convReq.mediaItems || convReq.mediaItems.length === 0) {
      Spicetify.showNotification("Couldn't fetch radio from Spotify...", true, 1000);
      return;
    }
    
    let playlistID = convReq.mediaItems[0].uri.substr(8);
    
    const sse = new EventSource(
      `https://open.spoqify.com/anonymize?url=${playlistID}`
    );

    sse.addEventListener("done", function (e) {
      sse.close();
      let anonymizedURL = e.data.replace("https://open.spotify.com", "");

      Spicetify.showNotification("Anonymizing radio, please wait...", false, 1000);

      // Eventually replace with something that just uses Cosmos to check the playlist items...
			setTimeout(() => {
				Spicetify.Platform.History.push(anonymizedURL);
				Spicetify.showNotification("Radio anonymized!", false, 1000);
			}, 2500);
    });

    sse.addEventListener("error", function (e) {
      sse.close();
      console.error(e);
      Spicetify.showNotification("Something went wrong, maybe you're trying it on something that isn't auto-generated?", true, 1000)
    });
  }

  function shouldDisplayContextMenu(uris) {
    // Don't allow multi select
    if (uris.length > 1) return false;

    const uriObj = Spicetify.URI.fromString(uris[0]);

    // Exclude DJ
    if (uriObj.id === "37i9dQZF1EYkqdzj48dyYq") return false;

    const allowedTypes = [
      Spicetify.URI.Type.TRACK,
      Spicetify.URI.Type.ALBUM,
      Spicetify.URI.Type.PLAYLIST_V2,
      Spicetify.URI.Type.ARTIST
    ];

    return allowedTypes.includes(uriObj.type);
  }

  const cntxMenu = new Spicetify.ContextMenu.Item(
    "Create anonymized radio",
    makePlaylist,
    shouldDisplayContextMenu
  );

  cntxMenu.register();
})();