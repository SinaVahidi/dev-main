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

const accordionItems = document.querySelectorAll('.accordion-item-inner-faq');

accordionItems.forEach(element => {
  element.addEventListener('click', () => {
    element.classList.toggle('active-faq');

    if(element.classList.contains('active-faq')){
      element.style.background = null;
    }else {
      element.style.background = 'white';
    }
    element.parentElement.parentElement.style.maxHeight = '200rem';
  });
});

const accordionColumns = document.querySelectorAll('.accordion-column-faq');
accordionColumns.forEach(element => {
  for(let i = 4; i < element.children.length - 1; i++)
  {
    element.children[i].style.display = 'none';
  }
  element.firstElementChild.lastElementChild.addEventListener('click', (btn) => {
    element.classList.toggle('active-faq-all');
    element.classList.toggle('active-faq-col');
    element.style.maxHeight = '200rem';
    element.firstElementChild.lastElementChild.firstElementChild.classList.toggle('dis-none');
    element.firstElementChild.lastElementChild.lastElementChild.classList.toggle('dis-none');
    for(let i = 0; i < element.children.length; i++){
      if(element.children[i].firstElementChild.classList.contains('active-faq'))
      {
        element.children[i].firstElementChild.classList.toggle('active-faq');
      }
    }
  })
  element.lastElementChild.addEventListener('click', () => {
    element.lastElementChild.classList.toggle('active-faq');
    element.classList.toggle('active-faq-col');
    if(element.lastElementChild.classList.contains('active-faq')){
      for(let i = 1; i < element.children.length - 1; i++)
      {
        element.children[i].style.display = 'block';
      }
      element.style.overflow = 'hidden';
      element.lastElementChild.firstElementChild.style.display = 'none';
      element.lastElementChild.lastElementChild.style.display = 'inline';
      element.style.maxHeight = '200rem';
    }else {
      for(let i = 4; i < element.children.length - 1; i++)
      {
        element.children[i].style.display = 'none';
      }
      element.lastElementChild.firstElementChild.style.display = 'inline';
      element.lastElementChild.lastElementChild.style.display = 'none';
      element.style.maxHeight = null;
    }
  });
});

const subscriptionIconColumns = document.querySelectorAll('.ffc-page-subscription-landing .landing-block--columns-with-icons .flex');
// console.log(subscriptionIconColumns);
// subscriptionIconColumns.forEach(element => {
//   window.onscroll = function(){
//     if(window.scrollTop == 250){
//       console.log('test');
//     }
//   }
// });





$(function() {
    $(".coupon-btn" ).click(function() {
      $( ".coupon-area-expand" ).show();
      $( "#coupon-msg" ).text("Please enter your code");
      $( "#coupon-msg" ).css("text-decoration", "none");
    });
  	$('.nom-close').click(() => {
      $('.nom-alert').hide();
	});

  $(window).scroll(function() {
    let scrollTop = $(window).scrollTop();

    if (scrollTop > 250) {
        $('.ffc-page-subscription-landing .landing-block--columns-with-icons .column-with-icon').css('margin-inline', '6.5rem');
    }
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


