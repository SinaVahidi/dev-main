theme.shipBar = (function() {
  let bar = document.querySelector(".free-shipping-notice");
  let threshold = bar.dataset.threshold;
  let unlocked_text = bar.dataset.unlocked;
  let promotion_text = bar.dataset.promotion;
  function update(){
    $.getJSON('/cart.js').then(
      function(cart) {
        let remaining = threshold - cart.total_price;
        let remainingMoney = theme.Currency.formatMoney(remaining, '${{ amount }}');

        if(remaining > 0){
          bar.innerText = promotion_text.replace('[value]', remainingMoney);
        }else{
          bar.innerText = unlocked_text ;
        }
      });
  }
  return { update:update }
}) ();

$(function() {
    $(".coupon-btn" ).click(function() {
      $( ".coupon-area-expand" ).show();
      $( "#coupon-msg" ).text("Please enter your code");
      $( "#coupon-msg" ).css("text-decoration", "none");
    });
  	$('.nom-close').click(() => {
      $('.nom-alert').hide();
	});

	$(".js-drawer-open-nav").click(function() {
      $(".parent-trigger-shop").addClass("is-open");
      $(".about-sublist").hide();
      $(".shop-sublist").show();
      $(".parent-trigger-about").removeClass("is-open");
      $("#Linklist-collections-all1").addClass("is-open");
      $("#Linklist-collections-all1").css("height", "auto");
      $(".child-trigger-shop").removeClass("is-open");
      $(".child-trigger-fav").removeClass("is-open");
      $(".mobile-nav__grandchildlist").hide();
      $(".grandchildlist-shop").hide();
      $(".grandchildlist-fav").hide();
      $("#Sublinklist-collections-all1-collections-all1").hide();
      $("#Sublinklist-collections-all1-collections-all1").removeClass("is-open");
      $("#Sublinklist-collections-all1-collections-flavours2").hide();
      $("#Sublinklist-collections-all1-collections-flavours2").removeClass("is-open");

    });

    $(".parent-trigger-about").click(function() {
      $(".about-sublist").show();
	});

	$(".child-trigger-shop").click(function() {
  	  $(".grandchildlist-shop").show();
      $("#Sublinklist-collections-all1-collections-all1").show();
    });

	$(".child-trigger-fav").click(function() {
  	  $(".grandchildlist-fav").show();
      $("#Sublinklist-collections-all1-collections-flavours2").show();
    });
	
	$('.site-nav__link--icon').click(() => {
      $('#yotpo_testimonials_btn').hide();
	});   
    
    $('.drawer__close-button').click(() => {
      $('#yotpo_testimonials_btn').show();
	});   
});


