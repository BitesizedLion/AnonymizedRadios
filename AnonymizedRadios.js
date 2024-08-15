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

      Spicetify.Platform.History.push(anonymizedURL + "_+");
  		setTimeout(() => {
  			Spicetify.Platform.History.repalce(anonymizedURL);
  			Spicetify.showNotification("Radio anonymized!", false, 1000);
  		}, 3000);
    });

    sse.addEventListener("error", function (e) {
      sse.close();
      console.error(e);
      Spicetify.showNotification("Something went wrong, maybe the playlist is private?", true, 1000)
    });
  }

  function shouldDisplayContextMenu(uris) {
    if (uris.length > 1) return false;

    const uriObj = Spicetify.URI.fromString(uris[0]);

    if (uriObj.id === "37i9dQZF1EYkqdzj48dyYq") return false; // Handle DJ

    if (uriObj.type === Spicetify.URI.Type.TRACK) return true;
    if (uriObj.type === Spicetify.URI.Type.ALBUM) return true;
    if (uriObj.type === Spicetify.URI.Type.PLAYLIST) return true;
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
