(function anonymizedradios() {
  const { Platform, URI } = Spicetify;

  async function makePlaylist(uris) {
    const trackID = uris[0].substr(8);

    const sse = new EventSource(
      `https://open.spoqify.com/anonymize?url=${trackID}`
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
    if (uris.length > 1) return false;

    const uriObj = Spicetify.URI.fromString(uris[0]);

    if (uriObj.id === "37i9dQZF1EYkqdzj48dyYq") return false; // Handle DJ

    if (uriObj.type === Spicetify.URI.Type.TRACK) return true;
    if (uriObj.type === Spicetify.URI.Type.ALBUM) return true;
    if (uriObj.type === Spicetify.URI.Type.PLAYLIST_V2) return true;
    if (uriObj.type === Spicetify.URI.Type.ARTIST) return true;


    return false;
  }

  const cntxMenu = new Spicetify.ContextMenu.Item(
    "Create anonymized radio",
    makePlaylist,
    shouldDisplayContextMenu
  );

  cntxMenu.register();
})();
