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
      element.lastElementChild.style.maxHeight = element.lastElementChild.scrollHeight + 'px';
    }else {
      element.lastElementChild.style.maxHeight = '0px';
    }
  });
});

const accordionColumn1 = document.querySelectorAll('.accordion-column1-faq .accordion-item-inner-faq');
const accordionColumn2 = document.querySelectorAll('.accordion-column2-faq .accordion-item-inner-faq');
const accordionColumn3 = document.querySelectorAll('.accordion-column3-faq .accordion-item-inner-faq');
const accordionColumn4 = document.querySelectorAll('.accordion-column4-faq .accordion-item-inner-faq');

for(let i = 0; i < accordionColumn1.length - 3; i++)
{
  accordionColumn1[i].style.display = 'none';
}
for(let i = 0; i < accordionColumn2.length - 3; i++)
{
  accordionColumn2[i].style.display = 'none';
}
for(let i = 0; i < accordionColumn3.length - 3; i++)
{
  accordionColumn3[i].style.display = 'none';
}
for(let i = 0; i < accordionColumn4.length - 3; i++)
{
  accordionColumn4[i].style.display = 'none';
}

console.log(accordionColumn1);

const expandButton1 = document.querySelector('.expand-btn1');
const expandButton2 = document.querySelector('.expand-btn2');
const expandButton3 = document.querySelector('.expand-btn3');
const expandButton4 = document.querySelector('.expand-btn4');

const closeButton1 = document.querySelector('.close-btn1');
const closeButton2 = document.querySelector('.close-btn2');
const closeButton3 = document.querySelector('.close-btn3');
const closeButton4 = document.querySelector('.close-btn4');

expandButton1.addEventListener('click', () => {
  for(let i = 0; i < accordionColumn1.length; i++)
  {
    accordionColumn1[i].style.display = 'block';
  }
  expandButton1.style.display = 'none';
  closeButton1.style.display = 'inline';
});
expandButton2.addEventListener('click', () => {
  for(let i = 0; i < accordionColumn2.length; i++)
  {
    accordionColumn2[i].style.display = 'block';
  }
  expandButton2.style.display = 'none';
  closeButton2.style.display = 'inline';
});

expandButton3.addEventListener('click', () => {
  for(let i = 0; i < accordionColumn3.length; i++)
  {
    accordionColumn3[i].style.display = 'block';
  }
  expandButton3.style.display = 'none';
  closeButton3.style.display = 'inline';
});

expandButton4.addEventListener('click', () => {
  for(let i = 0; i < accordionColumn4.length; i++)
  {
    accordionColumn4[i].style.display = 'block';
  }
  expandButton4.style.display = 'none';
  closeButton4.style.display = 'inline';
});

closeButton1.addEventListener('click', () => {
  for(let i = 0; i < accordionColumn1.length - 3; i++)
  {
    accordionColumn1[i].style.display = 'none';
  }
  expandButton1.style.display = 'inline';
  closeButton1.style.display = 'none';
});
closeButton2.addEventListener('click', () => {
  for(let i = 0; i < accordionColumn2.length - 3; i++)
  {
    accordionColumn2[i].style.display = 'none';
  }
  expandButton2.style.display = 'inline';
  closeButton2.style.display = 'none';
});

closeButton3.addEventListener('click', () => {
  for(let i = 0; i < accordionColumn3.length - 3; i++)
  {
    accordionColumn3[i].style.display = 'none';
  }
  expandButton3.style.display = 'inline';
  closeButton3.style.display = 'none';
});

closeButton4.addEventListener('click', () => {
  for(let i = 0; i < accordionColumn4.length - 3; i++)
  {
    accordionColumn4[i].style.display = 'none';
  }
  expandButton4.style.display = 'inline';
  closeButton4.style.display = 'none';
});


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


