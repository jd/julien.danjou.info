function bootstrap_tab_bookmark (selector) {
    if (selector == undefined) {
        selector = "";
    }

    /* Automagically jump an good tab based on anchor */
    $(document).ready(function() {
        url = document.location.href.split('#');
        $(selector + '[href=#'+url[1]+']').click();
    });

    /* Update hash based on tab */
    $(selector + "[data-toggle=tab]").click(function (event) {
        document.location.hash = this.getAttribute("href");
    });
}
