
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
            sparouter.initialized = true;

            makeAllPagesInvisible();
            window.document.querySelectorAll("div[data-page]")[0].style.display = "block";

            registerClickHandler();
        }

        function registerClickHandler() {
            var selectedAHrefs = window.document.querySelectorAll("a[href^='#']");
            for (var j = 0; j < selectedAHrefs.length; j++) {
                console.log("add Event handler");
                selectedAHrefs[j].addEventListener("click", function(e) {
                    var url = this.getAttribute("href");
                    console.log("clicked on " + url);
                    makeAllPagesInvisible();
                    url = url.substring(1);
                    var newPage = window.document.querySelector("div[data-page=" + url + "]");
                    newPage.style.display = "block";

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

    sparouter(document);


    sparouter("#oldurl", "#newurl").removeUrlFromHistory().handle(function() {
        console.log("here we go!");
    });

//   console.dir(sparouter);
};


// sparouter("newpage").handle(function(){})
//
//
//
