(function (BW, $, undefined) {

    /* ==========================================================================
     3:          Story
     Description:

     Templates:
     Components:
    ========================================================================== */

    BW.Story = (function () {
        var Story = function () {

            var s = this;

            this.init = function() {
                $(document).on('click', 'a.page-divider', function (e) {
                    e.preventDefault();
                    $(".part-two").addClass('show');
                    $(".story-content .module.links-list.links-list-quick").addClass('shift-down');
                    $(this).parent().removeClass('show');

                    s.promoHeight();
                });

                // Set the Story Promo Height
                s.promoHeight();
            }

            this.promoHeight = function () {
                // Match the height of the story Promo with the Main Content
                var storyPromo = $('.story-content .story-promos'),
                        i;

                for (i = 0; i < storyPromo.length; i++) {
                    curElem = $(storyPromo[i]);
                    // Assign the value of the parent (LI) to the Story Promo aside
                    curElem.height(curElem.parent().height() - 20);
                }
            }
        }
        return new Story();
    }());


}(window.BW = window.BW || {}, jQuery));