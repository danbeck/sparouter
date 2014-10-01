
window.sparouter = (function() {

    function Sparouter(newurl, oldurl) {
        this.newurl = newurl;
        this.oldurl = oldurl;
    }

    Sparouter.prototype.handle = function(callback) {
        if (!sparouter.callbacks)
            sparouter.callbacks = [];
        sparouter.callbacks.push({oldurl: this.oldurl, newurl: this.newurl, callback: callback});
    };

    Sparouter.prototype.removeUrlFromHistory = function(callback) {
        this.removeUrlFromHistory = true;
        return this;
    };


    var sparouter = function(oldurl, newurl) {
        if (!sparouter.initialized) {
            window.onpopstate = function(event) {
                console.log("onpopstate: ", +document.location + ", state: " + JSON.stringify(event.state));
            };
            window.onhashchange = function(event) {
                console.log("onhashchange: ", +document.location + ", hash:" + document.location.hash +
                        ", oldurl:" + event.oldURL + ", newurl:" + event.newURL + ", state: " + JSON.stringify(event.state));
                var hash = document.location.hash;
                makeAllPagesInvisible();
                var newPage = window.document.querySelector("div[data-page=" + hash.substring(1) + "]");
                newPage.style.display = "block";
            };
            sparouter.initialized = true;
            handleLinks();
            handleBackLinks();

            makeAllPagesInvisible();
            window.document.querySelectorAll("div[data-page]")[0].style.display = "block";
        }

        function handleLinks() {
            var aLinks = window.document.querySelectorAll("a[href^='#']");
            for (var i = 0; i < aLinks.length; i++) {
                aLinks[i].addEventListener("click", function(e) {
                    var currentLink = this;
                    e.preventDefault();
                    var hash = currentLink.getAttribute("href");
                    if (currentLink.getAttribute("data-option") === "removeFromHistory") {
//                        console.log("follow link " + hash + "but remove actual entry " + window.location.hash + "from history");
//                        history.replaceState({}, "hashurl", hash);
//                        window.location.hash = hash;
//                        history.back();
                        window.location.replace(hash);
                    }
                    else {
                        console.log("follows link " + hash);
                        window.location.hash = hash;
                    }
//                    history.back()    ;
                });
            }
        }
        function handleBackLinks() {
            var backbuttons = window.document.querySelectorAll("a[href='#back']");
            for (var i = 0; i < backbuttons.length; i++) {
                backbuttons[i].addEventListener("click", function(e) {
                    e.preventDefault();
                    history.back();
                });
            }
        }

        function makeAllPagesInvisible() {
            var datapages = window.document.querySelectorAll("div[data-page]");
            for (var i = 0; i < datapages.length; i++) {
                datapages[i].style.display = "none";
            }
        }

        return new Sparouter(newurl, oldurl);
    };
    return sparouter;

}());


window.onload = function() {
    console.log(document.location);
    var pages = window.document.querySelectorAll("div[data-page]");
    if (pages.length > 0) {
        var hash = pages[0].getAttribute("data-page");
        history.pushState({}, "start", "#" + hash);
    }

    sparouter("#oldurl", "#newurl").removeUrlFromHistory().handle(function() {
        console.log("here we go!");
    });

//   console.dir(sparouter);
};


// sparouter("newpage").handle(function(){})
//
//
//
