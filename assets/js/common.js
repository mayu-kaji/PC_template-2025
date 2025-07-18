/*----------------------------------------------
// ページトップボタン ＆ スムーススクロール
----------------------------------------------*/
jQuery(function ($) {

  // ▼ページトップボタン制御
  const $topBtn = $('.js-pagetop').hide();

  $(window).on('scroll', function () {
    $topBtn[($(this).scrollTop() > 70) ? 'fadeIn' : 'fadeOut']();
  });

  $topBtn.on('click', function () {
    $('html,body').animate({ scrollTop: 0 }, 300, 'swing');
    return false;
  });

  // ▼スムーススクロール
  $(document).on('click', 'a[href*="#"]', function () {
    const $header = $('header');
    const $target = $(this.hash);
    if (!$target.length) return;
    const targetY = $target.offset().top - $header.innerHeight();
    $('html,body').animate({ scrollTop: targetY }, 400, 'swing');
    return false;
  });

  /*----------------------------------------------
  // ハンバーガーメニュー
  ----------------------------------------------*/
  const $hamburger = $('.js-hamburger');
  const $drawer = $('.js-drawer');

  function openDrawer() {
    $drawer.fadeIn();
    $hamburger.addClass('is-open');
  }
  function closeDrawer() {
    $drawer.fadeOut();
    $hamburger.removeClass('is-open');
  }

  $hamburger.on('click', function () {
    $(this).toggleClass('is-open');
    $(this).hasClass('is-open') ? openDrawer() : closeDrawer();
  });

  $drawer.on('click', 'a[href]', closeDrawer);

  $(window).on('resize', function () {
    if (window.matchMedia('(max-width: 767px)').matches) {
      closeDrawer();
    }
  });

  /*----------------------------------------------
  // アコーディオン
  ----------------------------------------------*/
  const $closed = $('.js-closed').hide();
  $('.js-rotate').removeClass('is-active');

  $('.js-accordion').on('click', function () {
    const $answer = $(this).next('.js-closed');
    $answer.slideToggle(200);
    $(this).find('.js-rotate').toggleClass('is-active');
  });

  $closed.on('click', function () {
    $(this).slideUp(200)
      .prev('.js-accordion')
      .find('.js-rotate')
      .removeClass('is-active');
  });

  /*----------------------------------------------
  // ヘッダー　スクロールで非表示・上で表示
  ----------------------------------------------*/
  const $headerFixed = $('.js-header');
  const headerHeight = $headerFixed.outerHeight();
  let beforeScrollTop = 0;

  $(window).on('scroll', function () {
    const scrollTop = $(this).scrollTop();
    if (scrollTop > beforeScrollTop && scrollTop > headerHeight) {
      $headerFixed.addClass('js-hide');
    } else {
      $headerFixed.removeClass('js-hide');
    }
    beforeScrollTop = scrollTop;
  });

});

/*----------------------------------------------
// Swiper スライダー
----------------------------------------------*/
const swipeOption = {
  loop: true,
  effect: 'fade',
  fadeEffect: { crossFade: true },
  autoplay: {
    delay: 4000,
    disableOnInteraction: false,
  },
  speed: 2000,
  allowTouchMove: false,
};
new Swiper('.swiper-container', swipeOption);

/*----------------------------------------------
// GSAPアニメーション例
----------------------------------------------*/
// gsap.set('.js-target', {
//   opacity: 0,
//   y: 50,
// });
// ScrollTrigger.batch('.js-target', {
//   onEnter: batch => gsap.to(batch, {
//     opacity: 1,
//     y: 0,
//     stagger: 0.3,
//     overwrite: true,
//     duration: 0.7,
//   }),
//   start: 'top 70%',
// });

// gsap.set('.js-target02', {
//   opacity: 0,
//   x: -50,
// });
// ScrollTrigger.batch('.js-target02', {
//   onEnter: batch => gsap.to(batch, {
//     opacity: 1,
//     x: 0,
//     stagger: 0.3,
//     overwrite: true,
//     duration: 1,
//     delay: 0.5,
//   }),
//   start: 'top 70%',
// });
