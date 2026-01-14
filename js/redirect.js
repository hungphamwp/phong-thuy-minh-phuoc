(function () {
    var host = window.location.hostname;
    var protocol = window.location.protocol;
    var targetHost = "lichphongthuy.vn";

    // Check if we need to redirect
    if (host.startsWith("www.") || protocol === "http:") {
        var newUrl = "https://" + targetHost + window.location.pathname + window.location.search + window.location.hash;

        // Use 301-like behavior in browser (replace state)
        window.location.replace(newUrl);
    }
})();
