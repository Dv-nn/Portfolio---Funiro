"use strict"

document.addEventListener('DOMContentLoaded', () => {

   //Search
   document.querySelector('.search-form__icon').addEventListener('click', function () {
      document.querySelector('.search-form').classList.toggle('active-search');
   })

   //Collapsible
   const coll = document.querySelectorAll(".collapsible");
   let i;

   for (i = 0; i < coll.length; i++) {
      
      coll[i].addEventListener("click", function () {
         this.classList.toggle('active-coll');
         const content = this.nextElementSibling;
         if (content.style.display === "block") {
            content.style.display = "none";
         } else {
            content.style.display = "block";
         }
      });
   }

   //Active-menu
   document.querySelector('.icon-menu').addEventListener('click', function () {
      this.classList.toggle('active-burger');
      document.querySelector('.menu__body').classList.toggle('active-menu');
   })

   
   //Header
   const headerElement = document.querySelector('.header');

   const callback = function (entries, observer) {
      if (entries[0].isIntersecting) {
         headerElement.classList.remove('scroll');
      } else {
         headerElement.classList.add('scroll');
      }
   };

   const headerObserver = new IntersectionObserver(callback);
   headerObserver.observe(headerElement);


  //Actions
   window.onload = function () {
      document.addEventListener('click', documentActions);
   }
   
   function documentActions(e) {
      const targetElement = e.target;

      if (targetElement.classList.contains('products__more')) {
         getProducts(targetElement);
         e.preventDefault();
      }
      if (targetElement.classList.contains('actions-product__button')) {
         const productId = targetElement.closest('.item-product').dataset.pid;
         addToCart(targetElement, productId);
         e.preventDefault();
      }
      if (targetElement.classList.contains('cart-header__icon') || targetElement.closest('.cart-header__icon')) {
			if (document.querySelector('.cart-list').children.length > 0) {
				document.querySelector('.cart-header').classList.toggle('active-cart');
			}
			e.preventDefault();
		} else if (!targetElement.closest('.cart-header') && !targetElement.classList.contains('actions-product__button')) {
			document.querySelector('.cart-header').classList.remove('active-cart');
		}
      if (targetElement.classList.contains('cart-list__delete')) {
			const productId = targetElement.closest('.cart-list__item').dataset.cartPid;
			updateCart(targetElement, productId, false);
			e.preventDefault();
		}
   }

   //Products
   async function getProducts(btn) {
      if (!btn.classList.contains('hold')) {
         btn.classList.add('hold');
         const file = 'json/products.json';
         let response = await fetch(file, {
            method: 'GET'
         });
         if (response.ok) {
            let result = await response.json();
            loadProducts(result);
            btn.classList.remove('hold');
            btn.remove();
         } else {
            alert('Error');
         }
      }
   }

   function loadProducts(data) {
      const productsItems = document.querySelector('.products__items');

      data.products.forEach(item => {
			const productId = item.id;
			const productUrl = item.url;
			const productImage = item.image;
			const productTitle = item.title;
			const productText = item.text;
			const productPrice = item.price;
			const productOldPrice = item.priceOld;
			const productShareUrl = item.shareUrl;
			const productLikeUrl = item.likeUrl;
			const productLabels = item.labels;
   
         let productTemplateStart = `<article data-pid="${productId}" class="products__item item-product">`;
			let productTemplateEnd = `</article>`;
   
         let productTemplateLabels = '';
			if (productLabels) {
				let productTemplateLabelsStart = `<div class="item-product__labels">`;
				let productTemplateLabelsEnd = `</div>`;
				let productTemplateLabelsContent = '';

				productLabels.forEach(labelItem => {
					productTemplateLabelsContent += `<div class="item-product__label item-product__label_${labelItem.type}">${labelItem.value}</div>`;
				});

				productTemplateLabels += productTemplateLabelsStart;
				productTemplateLabels += productTemplateLabelsContent;
				productTemplateLabels += productTemplateLabelsEnd;
			}
   
         let productTemplateImage = `
            <a href="${productUrl}" class="item-product__image ibg">
               <img src="img/products/${productImage}" alt="${productTitle}">
            </a>
	      `;
         
         let productTemplateBodyStart = `<div class="item-product__body">`;
			let productTemplateBodyEnd = `</div>`;
   
         let productTemplateContent = `
            <div class="item-product__content">
               <h3 class="item-product__title">${productTitle}</h3>
               <div class="item-product__text">${productText}</div>
            </div>
	      `;
   
         let productTemplatePrices = '';
			let productTemplatePricesStart = `<div class="item-product__prices">`;
			let productTemplatePricesCurrent = `<div class="item-product__price">Rp ${productPrice}</div>`;
			let productTemplatePricesOld = `<div class="item-product__price item-product__price_old">Rp ${productOldPrice}</div>`;
			let productTemplatePricesEnd = `</div>`;
   
         productTemplatePrices = productTemplatePricesStart;
			productTemplatePrices += productTemplatePricesCurrent;
			if (productOldPrice) {
				productTemplatePrices += productTemplatePricesOld;
			}
			productTemplatePrices += productTemplatePricesEnd;
   
         let productTemplateActions = `
         <div class="item-product__actions actions-product">
         <div class="actions-product__body">
            <a href="" class="actions-product__button btn btn_white">Add to cart</a>
            <a href="${productShareUrl}" class="actions-product__link"><i class="fa-solid fa-share-nodes"></i>Share</a>
            <a href="${productLikeUrl}" class="actions-product__link"><i class="fa-regular fa-heart"></i>Like</a>
         </div>`;
   
         let productTemplateBody = '';
			productTemplateBody += productTemplateBodyStart;
			productTemplateBody += productTemplateContent;
			productTemplateBody += productTemplatePrices;
			productTemplateBody += productTemplateActions;
			productTemplateBody += productTemplateBodyEnd;

			let productTemplate = '';
			productTemplate += productTemplateStart;
			productTemplate += productTemplateLabels;
			productTemplate += productTemplateImage;
			productTemplate += productTemplateBody;
			productTemplate += productTemplateEnd;
   
         productsItems.insertAdjacentHTML('beforeend', productTemplate);
      });
   }

   //Add to cart
   function addToCart(productButton, productId) {
		if (!productButton.classList.contains('hold')) {
			productButton.classList.add('hold');
			productButton.classList.add('fly');

			const cart = document.querySelector('.cart-header__icon');
			const product = document.querySelector(`[data-pid="${productId}"]`);
			const productImage = product.querySelector('.item-product__image');

			const productImageFly = productImage.cloneNode(true);

			const productImageFlyWidth = productImage.offsetWidth;
			const productImageFlyHeight = productImage.offsetHeight;
			const productImageFlyTop = productImage.getBoundingClientRect().top;
			const productImageFlyLeft = productImage.getBoundingClientRect().left;

			productImageFly.setAttribute('class', 'flyImage ibg');
			productImageFly.style.cssText = `
			left: ${productImageFlyLeft}px;
			top: ${productImageFlyTop}px;
			width: ${productImageFlyWidth}px;
			height: ${productImageFlyHeight}px;
		   `;

			document.body.append(productImageFly);

			const cartFlyLeft = cart.getBoundingClientRect().left;
			const cartFlyTop = cart.getBoundingClientRect().top;

			productImageFly.style.cssText = `
			left: ${cartFlyLeft}px;
			top: ${cartFlyTop}px;
			width: 0px;
			height: 0px;
			opacity:0;
		   `;

         productImageFly.addEventListener('transitionend', function () {
            if (productButton.classList.contains('fly')) {
               productImageFly.remove();
               updateCart(productButton, productId);
               productButton.classList.remove('fly');
            }
         });

      }
   }

   function updateCart(productButton, productId, productAdd = true) {
      const cart = document.querySelector('.cart-header');
		const cartIcon = cart.querySelector('.cart-header__icon');
		const cartQuantity = cartIcon.querySelector('span');
		const cartProduct = document.querySelector(`[data-cart-pid="${productId}"]`);
      const cartList = document.querySelector('.cart-list');
      
      //add goods
      if (productAdd) {
         if (cartQuantity) {
				cartQuantity.innerHTML = ++cartQuantity.innerHTML;
			} else {
				cartIcon.insertAdjacentHTML('beforeend', `<span>1</span>`);
         }
         if (!cartProduct) {
            const product = document.querySelector(`[data-pid="${productId}"]`);
            const cartProductImage = product.querySelector('.item-product__image').innerHTML;
            const cartProductTitle = product.querySelector('.item-product__title').innerHTML;
            const cartProductContent = `
               <a href="" class="cart-list__image ibg">${cartProductImage}</a>
               <div class="cart-list__body">
                  <a href="" class="cart-list__title">${cartProductTitle}</a>
                  <div class="cart-list__quantity">Quantity: <span>1</span></div>
                  <a href="" class="cart-list__delete">Delete</a>
               </div>`;
            cartList.insertAdjacentHTML('beforeend', `<li data-cart-pid="${productId}" class="cart-list__item">${cartProductContent}</li>`);
         } else {
            const cartProductQuantity = cartProduct.querySelector('.cart-list__quantity span');
            cartProductQuantity.innerHTML = ++cartProductQuantity.innerHTML;
         }

         productButton.classList.remove('hold');
      } else {
         const cartProductQuantity = cartProduct.querySelector('.cart-list__quantity span');
			cartProductQuantity.innerHTML = --cartProductQuantity.innerHTML;
			if (!parseInt(cartProductQuantity.innerHTML)) {
				cartProduct.remove();
			}

			const cartQuantityValue = --cartQuantity.innerHTML;

			if (cartQuantityValue) {
				cartQuantity.innerHTML = cartQuantityValue;
			} else {
				cartQuantity.remove();
				cart.classList.remove('active-cart');
			}
      }
   }


   //Slider-main
   const swiper_main = new Swiper('.slider-main__body', {
      observer: true,
      observeParents: true,
      slidesPerView: 1,
      spaceBetween: 32,
      speed: 800,
      loop: true,
      parallax: true,
      loopAdditionalSlides: 5,
      centeredSlides: false,
      reverseDirection: true,
      pagination: {
         el: '.controls-slider-main__dotts',
         clickable: true,
      },
      navigation: {
         nextEl: '.slider-main .slider-arrow_next',
         prevEl: '.slider-main .slider-arrow_prev',
      },
      keyboard: {
         enabled: true
      }
   });

   //Slider-rooms
   const swiper_rooms = new Swiper('.slider-rooms__body', {
      observer: true,
      observeParents: true,
      slidesPerView: 'auto',
      spaceBetween: 24,
      speed: 800,
      loop: true,
      parallax: true,
      loopAdditionalSlides: 5,
      centeredSlides: false,
      reverseDirection: true,
      pagination: {
         el: '.slider-rooms__dotts',
         clickable: true,
      },
      navigation: {
         nextEl: '.slider-rooms .slider-arrow_next',
         prevEl: '.slider-rooms .slider-arrow_prev',
      },
      keyboard: {
         enabled: true
      }
   });

   //Slider-tips
   const swiper_tips = new Swiper('.slider-tips__body', {
      observer: true,
      observeParents: true,
      slidesPerView: 3,
      spaceBetween: 32,
      speed: 800,
      loop: true,
      watchOverflow: true,
      parallax: true,
      preloadImages: false,
      centeredSlides: false,
      loopAdditionalSlides: 3,
      pagination: {
         el: '.slider-tips__dotts',
         clickable: true,
      },
      navigation: {
         nextEl: '.slider-tips .slider-arrow_next',
         prevEl: '.slider-tips .slider-arrow_prev'
      },
      breakpoints: {
         320: {
            slidesPerView: 1.1,
            spaceBetween: 15
         },
         768: {
            slidesPerView: 2,
            spaceBetween: 20
         },
         992: {
            slidesPerView: 3,
            spaceBetween: 32
         }
      },
      keyboard: {
         enabled: true
      }
   });


   //Slider-furniture
   const furniture = document.querySelector('.furniture__body');
   const furnitureItems = document.querySelector('.furniture__items');
   const furnitureColumn = document.querySelectorAll('.furniture__column');
   
   const speed = furniture.dataset.speed;

   let positionX = 0;
   let coordXprocent = 0;

   function setMouseGalleryStyle() {
      let furnitureItemsWidth = 0;
      furnitureColumn.forEach(element => {
         furnitureItemsWidth += element.offsetWidth;
      });

      const furnitureDifferent = furnitureItemsWidth - furniture.offsetWidth;
      const distX = Math.floor(coordXprocent - positionX);

      positionX = positionX + (distX * speed);
      let position = furnitureDifferent / 200 * positionX;

      furnitureItems.style.cssText = `transform: translate3d(${-position}px,0,0);`;

      if (Math.abs(distX) > 0) {
         requestAnimationFrame(setMouseGalleryStyle);
      } else {
         furniture.classList.remove('_init');
      }
   }

   furniture.addEventListener("mousemove", function (e) {
      const furnitureWidth = furniture.offsetWidth;

      const coordX = e.pageX - furnitureWidth / 2;

      coordXprocent = coordX / furnitureWidth * 200;

      if (!furniture.classList.contains('_init')) {
         requestAnimationFrame(setMouseGalleryStyle);
         furniture.classList.add('_init');
      }
   });


   //Page up
   let pageUpBtn = document.querySelector('.pageup');
   let rootElement = document.documentElement;

   function handleScroll() {
      let scrollTotal = rootElement.scrollHeight - rootElement.clientHeight;
      if (rootElement.scrollTop / scrollTotal > 0.25) {
         pageUpBtn.classList.add('showBtn');
      } else {
         pageUpBtn.classList.remove('showBtn');
      }
   }

   function scrollToTop() {
      rootElement.scrollTo({
        top: 0,
        behavior: "smooth"
      });
   }
   
   pageUpBtn.addEventListener('click', scrollToTop);
   document.addEventListener('scroll', handleScroll);


   //Login-form active
   const user = document.querySelector('.user-item');
   const modalActive = document.querySelector('.modal-form');
   const modalClose = document.querySelector('.modal-close');
  
    
   user.addEventListener('click', function () {
      modalActive.classList.add('active-modal');
   })

   modalClose.addEventListener('click', function () {
      modalActive.classList.remove('active-modal');
   })

})

