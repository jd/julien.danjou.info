function bootstrap_tab_bookmark (selector) {
    if (selector == undefined) {
        selector = "";
    }

    /* Automagically jump on good tab based on anchor */
    $(document).ready(function() {
        url = document.location.href.split('#');
        if(url[1] != undefined) {
            $(selector + '[href=#'+url[1]+']').tab('show');
        }
    });

    /* Update hash based on tab */
    $(selector + "[data-toggle=pill]").click(function (event) {
        document.location.hash = this.getAttribute("href");
    });
}
