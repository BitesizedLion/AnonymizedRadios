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

      Spicetify.Platform.History.push(anonymizedURL);
    });

    sse.addEventListener("error", function (e) {
      sse.close();
      console.error(error);
      Spicetify.showNotification("Something went wrong, try again", true, 1000)
    });
  }

  function shouldDisplayContextMenu(uris) {
    if (uris.length > 1) return false;

    const uriObj = Spicetify.URI.fromString(uris[0]);

    if (uriObj.type === Spicetify.URI.Type.TRACK) return true;

    return false;
  }

  const cntxMenu = new Spicetify.ContextMenu.Item(
    "Create anonymized radio",
    makePlaylist,
    shouldDisplayContextMenu
  );

  cntxMenu.register();
})();
