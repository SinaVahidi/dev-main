(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[0],{

/***/ "./node_modules/glider-js/glider.js":
/*!******************************************!*\
  !*** ./node_modules/glider-js/glider.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/* @preserve
    _____ __ _     __                _
   / ___// /(_)___/ /___  ____      (_)___
  / (_ // // // _  // -_)/ __/_    / /(_-<
  \___//_//_/ \_,_/ \__//_/  (_)__/ //___/
                              |___/

  Version: 1.7.4
  Author: Nick Piscitelli (pickykneee)
  Website: https://nickpiscitelli.com
  Documentation: http://nickpiscitelli.github.io/Glider.js
  License: MIT License
  Release Date: October 25th, 2018

*/

/* global define */

(function (factory) {
   true
    ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))
    : undefined
})(function () {
  ('use strict') // eslint-disable-line no-unused-expressions

  /* globals window:true */
  var _window = typeof window !== 'undefined' ? window : this

  var Glider = (_window.Glider = function (element, settings) {
    var _ = this

    if (element._glider) return element._glider

    _.ele = element
    _.ele.classList.add('glider')

    // expose glider object to its DOM element
    _.ele._glider = _

    // merge user setting with defaults
    _.opt = Object.assign(
      {},
      {
        slidesToScroll: 1,
        slidesToShow: 1,
        resizeLock: true,
        duration: 0.5,
        // easeInQuad
        easing: function (x, t, b, c, d) {
          return c * (t /= d) * t + b
        }
      },
      settings
    )

    // set defaults
    _.animate_id = _.page = _.slide = 0
    _.arrows = {}

    // preserve original options to
    // extend breakpoint settings
    _._opt = _.opt

    if (_.opt.skipTrack) {
      // first and only child is the track
      _.track = _.ele.children[0]
    } else {
      // create track and wrap slides
      _.track = document.createElement('div')
      _.ele.appendChild(_.track)
      while (_.ele.children.length !== 1) {
        _.track.appendChild(_.ele.children[0])
      }
    }

    _.track.classList.add('glider-track')

    // start glider
    _.init()

    // set events
    _.resize = _.init.bind(_, true)
    _.event(_.ele, 'add', {
      scroll: _.updateControls.bind(_)
    })
    _.event(_window, 'add', {
      resize: _.resize
    })
  })

  var gliderPrototype = Glider.prototype
  gliderPrototype.init = function (refresh, paging) {
    var _ = this

    var width = 0

    var height = 0

    _.slides = _.track.children;

    [].forEach.call(_.slides, function (_, i) {
      _.classList.add('glider-slide')
      _.setAttribute('data-gslide', i)
    })

    _.containerWidth = _.ele.clientWidth

    var breakpointChanged = _.settingsBreakpoint()
    if (!paging) paging = breakpointChanged

    if (
      _.opt.slidesToShow === 'auto' ||
      typeof _.opt._autoSlide !== 'undefined'
    ) {
      var slideCount = _.containerWidth / _.opt.itemWidth

      _.opt._autoSlide = _.opt.slidesToShow = _.opt.exactWidth
        ? slideCount
        : Math.max(1, Math.floor(slideCount))
    }
    if (_.opt.slidesToScroll === 'auto') {
      _.opt.slidesToScroll = Math.floor(_.opt.slidesToShow)
    }

    _.itemWidth = _.opt.exactWidth
      ? _.opt.itemWidth
      : _.containerWidth / _.opt.slidesToShow;

    // set slide dimensions
    [].forEach.call(_.slides, function (__) {
      __.style.height = 'auto'
      __.style.width = _.itemWidth + 'px'
      width += _.itemWidth
      height = Math.max(__.offsetHeight, height)
    })

    _.track.style.width = width + 'px'
    _.trackWidth = width
    _.isDrag = false
    _.preventClick = false

    _.opt.resizeLock && _.scrollTo(_.slide * _.itemWidth, 0)

    if (breakpointChanged || paging) {
      _.bindArrows()
      _.buildDots()
      _.bindDrag()
    }

    _.updateControls()

    _.emit(refresh ? 'refresh' : 'loaded')
  }

  gliderPrototype.bindDrag = function () {
    var _ = this
    _.mouse = _.mouse || _.handleMouse.bind(_)

    var mouseup = function () {
      _.mouseDown = undefined
      _.ele.classList.remove('drag')
      if (_.isDrag) {
        _.preventClick = true
      }
      _.isDrag = false
    }

    var events = {
      mouseup: mouseup,
      mouseleave: mouseup,
      mousedown: function (e) {
        e.preventDefault()
        e.stopPropagation()
        _.mouseDown = e.clientX
        _.ele.classList.add('drag')
      },
      mousemove: _.mouse,
      click: function (e) {
        if (_.preventClick) {
          e.preventDefault()
          e.stopPropagation()
        }
        _.preventClick = false
      }
    }

    _.ele.classList.toggle('draggable', _.opt.draggable === true)
    _.event(_.ele, 'remove', events)
    if (_.opt.draggable) _.event(_.ele, 'add', events)
  }

  gliderPrototype.buildDots = function () {
    var _ = this

    if (!_.opt.dots) {
      if (_.dots) _.dots.innerHTML = ''
      return
    }

    if (typeof _.opt.dots === 'string') {
      _.dots = document.querySelector(_.opt.dots)
    } else _.dots = _.opt.dots
    if (!_.dots) return

    _.dots.innerHTML = ''
    _.dots.classList.add('glider-dots')

    for (var i = 0; i < Math.ceil(_.slides.length / _.opt.slidesToShow); ++i) {
      var dot = document.createElement('button')
      dot.dataset.index = i
      dot.setAttribute('aria-label', 'Page ' + (i + 1))
      dot.setAttribute('role', 'tab')
      dot.className = 'glider-dot ' + (i ? '' : 'active')
      _.event(dot, 'add', {
        click: _.scrollItem.bind(_, i, true)
      })
      _.dots.appendChild(dot)
    }
  }

  gliderPrototype.bindArrows = function () {
    var _ = this
    if (!_.opt.arrows) {
      Object.keys(_.arrows).forEach(function (direction) {
        var element = _.arrows[direction]
        _.event(element, 'remove', { click: element._func })
      })
      return
    }
    ['prev', 'next'].forEach(function (direction) {
      var arrow = _.opt.arrows[direction]
      if (arrow) {
        if (typeof arrow === 'string') arrow = document.querySelector(arrow)
        if (arrow) {
          arrow._func = arrow._func || _.scrollItem.bind(_, direction)
          _.event(arrow, 'remove', {
            click: arrow._func
          })
          _.event(arrow, 'add', {
            click: arrow._func
          })
          _.arrows[direction] = arrow
        }
      }
    })
  }

  gliderPrototype.updateControls = function (event) {
    var _ = this

    if (event && !_.opt.scrollPropagate) {
      event.stopPropagation()
    }

    var disableArrows = _.containerWidth >= _.trackWidth

    if (!_.opt.rewind) {
      if (_.arrows.prev) {
        _.arrows.prev.classList.toggle(
          'disabled',
          _.ele.scrollLeft <= 0 || disableArrows
        )
        _.arrows.prev.classList.contains('disabled')
          ? _.arrows.prev.setAttribute('aria-disabled', true)
          : _.arrows.prev.setAttribute('aria-disabled', false)
      }
      if (_.arrows.next) {
        _.arrows.next.classList.toggle(
          'disabled',
          Math.ceil(_.ele.scrollLeft + _.containerWidth) >=
            Math.floor(_.trackWidth) || disableArrows
        )
        _.arrows.next.classList.contains('disabled')
          ? _.arrows.next.setAttribute('aria-disabled', true)
          : _.arrows.next.setAttribute('aria-disabled', false)
      }
    }

    _.slide = Math.round(_.ele.scrollLeft / _.itemWidth)
    _.page = Math.round(_.ele.scrollLeft / _.containerWidth)

    var middle = _.slide + Math.floor(Math.floor(_.opt.slidesToShow) / 2)

    var extraMiddle = Math.floor(_.opt.slidesToShow) % 2 ? 0 : middle + 1
    if (Math.floor(_.opt.slidesToShow) === 1) {
      extraMiddle = 0
    }

    // the last page may be less than one half of a normal page width so
    // the page is rounded down. when at the end, force the page to turn
    if (_.ele.scrollLeft + _.containerWidth >= Math.floor(_.trackWidth)) {
      _.page = _.dots ? _.dots.children.length - 1 : 0
    }

    [].forEach.call(_.slides, function (slide, index) {
      var slideClasses = slide.classList

      var wasVisible = slideClasses.contains('visible')

      var start = _.ele.scrollLeft

      var end = _.ele.scrollLeft + _.containerWidth

      var itemStart = _.itemWidth * index

      var itemEnd = itemStart + _.itemWidth;

      [].forEach.call(slideClasses, function (className) {
        /^left|right/.test(className) && slideClasses.remove(className)
      })
      slideClasses.toggle('active', _.slide === index)
      if (middle === index || (extraMiddle && extraMiddle === index)) {
        slideClasses.add('center')
      } else {
        slideClasses.remove('center')
        slideClasses.add(
          [
            index < middle ? 'left' : 'right',
            Math.abs(index - (index < middle ? middle : extraMiddle || middle))
          ].join('-')
        )
      }

      var isVisible =
        Math.ceil(itemStart) >= Math.floor(start) &&
        Math.floor(itemEnd) <= Math.ceil(end)
      slideClasses.toggle('visible', isVisible)
      if (isVisible !== wasVisible) {
        _.emit('slide-' + (isVisible ? 'visible' : 'hidden'), {
          slide: index
        })
      }
    })
    if (_.dots) {
      [].forEach.call(_.dots.children, function (dot, index) {
        dot.classList.toggle('active', _.page === index)
      })
    }

    if (event && _.opt.scrollLock) {
      clearTimeout(_.scrollLock)
      _.scrollLock = setTimeout(function () {
        clearTimeout(_.scrollLock)
        // dont attempt to scroll less than a pixel fraction - causes looping
        if (Math.abs(_.ele.scrollLeft / _.itemWidth - _.slide) > 0.02) {
          if (!_.mouseDown) {
            // Only scroll if not at the end (#94)
            if (_.trackWidth > _.containerWidth + _.ele.scrollLeft) {
              _.scrollItem(_.getCurrentSlide())
            }
          }
        }
      }, _.opt.scrollLockDelay || 250)
    }
  }

  gliderPrototype.getCurrentSlide = function () {
    var _ = this
    return _.round(_.ele.scrollLeft / _.itemWidth)
  }

  gliderPrototype.scrollItem = function (slide, dot, e) {
    if (e) e.preventDefault()

    var _ = this

    var originalSlide = slide
    ++_.animate_id

    if (dot === true) {
      slide = slide * _.containerWidth
      slide = Math.round(slide / _.itemWidth) * _.itemWidth
    } else {
      if (typeof slide === 'string') {
        var backwards = slide === 'prev'

        // use precise location if fractional slides are on
        if (_.opt.slidesToScroll % 1 || _.opt.slidesToShow % 1) {
          slide = _.getCurrentSlide()
        } else {
          slide = _.slide
        }

        if (backwards) slide -= _.opt.slidesToScroll
        else slide += _.opt.slidesToScroll

        if (_.opt.rewind) {
          var scrollLeft = _.ele.scrollLeft
          slide =
            backwards && !scrollLeft
              ? _.slides.length
              : !backwards &&
                scrollLeft + _.containerWidth >= Math.floor(_.trackWidth)
                ? 0
                : slide
        }
      }

      slide = Math.max(Math.min(slide, _.slides.length), 0)

      _.slide = slide
      slide = _.itemWidth * slide
    }

    _.scrollTo(
      slide,
      _.opt.duration * Math.abs(_.ele.scrollLeft - slide),
      function () {
        _.updateControls()
        _.emit('animated', {
          value: originalSlide,
          type:
            typeof originalSlide === 'string' ? 'arrow' : dot ? 'dot' : 'slide'
        })
      }
    )

    return false
  }

  gliderPrototype.settingsBreakpoint = function () {
    var _ = this

    var resp = _._opt.responsive

    if (resp) {
      // Sort the breakpoints in mobile first order
      resp.sort(function (a, b) {
        return b.breakpoint - a.breakpoint
      })

      for (var i = 0; i < resp.length; ++i) {
        var size = resp[i]
        if (_window.innerWidth >= size.breakpoint) {
          if (_.breakpoint !== size.breakpoint) {
            _.opt = Object.assign({}, _._opt, size.settings)
            _.breakpoint = size.breakpoint
            return true
          }
          return false
        }
      }
    }
    // set back to defaults in case they were overriden
    var breakpointChanged = _.breakpoint !== 0
    _.opt = Object.assign({}, _._opt)
    _.breakpoint = 0
    return breakpointChanged
  }

  gliderPrototype.scrollTo = function (scrollTarget, scrollDuration, callback) {
    var _ = this

    var start = new Date().getTime()

    var animateIndex = _.animate_id

    var animate = function () {
      var now = new Date().getTime() - start
      _.ele.scrollLeft =
        _.ele.scrollLeft +
        (scrollTarget - _.ele.scrollLeft) *
          _.opt.easing(0, now, 0, 1, scrollDuration)
      if (now < scrollDuration && animateIndex === _.animate_id) {
        _window.requestAnimationFrame(animate)
      } else {
        _.ele.scrollLeft = scrollTarget
        callback && callback.call(_)
      }
    }

    _window.requestAnimationFrame(animate)
  }

  gliderPrototype.removeItem = function (index) {
    var _ = this

    if (_.slides.length) {
      _.track.removeChild(_.slides[index])
      _.refresh(true)
      _.emit('remove')
    }
  }

  gliderPrototype.addItem = function (ele) {
    var _ = this

    _.track.appendChild(ele)
    _.refresh(true)
    _.emit('add')
  }

  gliderPrototype.handleMouse = function (e) {
    var _ = this
    if (_.mouseDown) {
      _.isDrag = true
      _.ele.scrollLeft +=
        (_.mouseDown - e.clientX) * (_.opt.dragVelocity || 3.3)
      _.mouseDown = e.clientX
    }
  }

  // used to round to the nearest 0.XX fraction
  gliderPrototype.round = function (double) {
    var _ = this
    var step = _.opt.slidesToScroll % 1 || 1
    var inv = 1.0 / step
    return Math.round(double * inv) / inv
  }

  gliderPrototype.refresh = function (paging) {
    var _ = this
    _.init(true, paging)
  }

  gliderPrototype.setOption = function (opt, global) {
    var _ = this

    if (_.breakpoint && !global) {
      _._opt.responsive.forEach(function (v) {
        if (v.breakpoint === _.breakpoint) {
          v.settings = Object.assign({}, v.settings, opt)
        }
      })
    } else {
      _._opt = Object.assign({}, _._opt, opt)
    }

    _.breakpoint = 0
    _.settingsBreakpoint()
  }

  gliderPrototype.destroy = function () {
    var _ = this

    var replace = _.ele.cloneNode(true)

    var clear = function (ele) {
      ele.removeAttribute('style');
      [].forEach.call(ele.classList, function (className) {
        /^glider/.test(className) && ele.classList.remove(className)
      })
    }
    // remove track
    replace.children[0].outerHTML = replace.children[0].innerHTML
    clear(replace);
    [].forEach.call(replace.getElementsByTagName('*'), clear)
    _.ele.parentNode.replaceChild(replace, _.ele)
    _.event(_window, 'remove', {
      resize: _.resize
    })
    _.emit('destroy')
  }

  gliderPrototype.emit = function (name, arg) {
    var _ = this

    var e = new _window.CustomEvent('glider-' + name, {
      bubbles: !_.opt.eventPropagate,
      detail: arg
    })
    _.ele.dispatchEvent(e)
  }

  gliderPrototype.event = function (ele, type, args) {
    var eventHandler = ele[type + 'EventListener'].bind(ele)
    Object.keys(args).forEach(function (k) {
      eventHandler(k, args[k])
    })
  }

  return Glider
})


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9nbGlkZXItanMvZ2xpZGVyLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qIEBwcmVzZXJ2ZVxuICAgIF9fX19fIF9fIF8gICAgIF9fICAgICAgICAgICAgICAgIF9cbiAgIC8gX19fLy8gLyhfKV9fXy8gL19fXyAgX19fXyAgICAgIChfKV9fX1xuICAvIChfIC8vIC8vIC8vIF8gIC8vIC1fKS8gX18vXyAgICAvIC8oXy08XG4gIFxcX19fLy9fLy9fLyBcXF8sXy8gXFxfXy8vXy8gIChfKV9fLyAvL19fXy9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHxfX18vXG5cbiAgVmVyc2lvbjogMS43LjRcbiAgQXV0aG9yOiBOaWNrIFBpc2NpdGVsbGkgKHBpY2t5a25lZWUpXG4gIFdlYnNpdGU6IGh0dHBzOi8vbmlja3Bpc2NpdGVsbGkuY29tXG4gIERvY3VtZW50YXRpb246IGh0dHA6Ly9uaWNrcGlzY2l0ZWxsaS5naXRodWIuaW8vR2xpZGVyLmpzXG4gIExpY2Vuc2U6IE1JVCBMaWNlbnNlXG4gIFJlbGVhc2UgRGF0ZTogT2N0b2JlciAyNXRoLCAyMDE4XG5cbiovXG5cbi8qIGdsb2JhbCBkZWZpbmUgKi9cblxuKGZ1bmN0aW9uIChmYWN0b3J5KSB7XG4gIHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZFxuICAgID8gZGVmaW5lKGZhY3RvcnkpXG4gICAgOiB0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCdcbiAgICAgID8gKG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpKVxuICAgICAgOiBmYWN0b3J5KClcbn0pKGZ1bmN0aW9uICgpIHtcbiAgKCd1c2Ugc3RyaWN0JykgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtZXhwcmVzc2lvbnNcblxuICAvKiBnbG9iYWxzIHdpbmRvdzp0cnVlICovXG4gIHZhciBfd2luZG93ID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgPyB3aW5kb3cgOiB0aGlzXG5cbiAgdmFyIEdsaWRlciA9IChfd2luZG93LkdsaWRlciA9IGZ1bmN0aW9uIChlbGVtZW50LCBzZXR0aW5ncykge1xuICAgIHZhciBfID0gdGhpc1xuXG4gICAgaWYgKGVsZW1lbnQuX2dsaWRlcikgcmV0dXJuIGVsZW1lbnQuX2dsaWRlclxuXG4gICAgXy5lbGUgPSBlbGVtZW50XG4gICAgXy5lbGUuY2xhc3NMaXN0LmFkZCgnZ2xpZGVyJylcblxuICAgIC8vIGV4cG9zZSBnbGlkZXIgb2JqZWN0IHRvIGl0cyBET00gZWxlbWVudFxuICAgIF8uZWxlLl9nbGlkZXIgPSBfXG5cbiAgICAvLyBtZXJnZSB1c2VyIHNldHRpbmcgd2l0aCBkZWZhdWx0c1xuICAgIF8ub3B0ID0gT2JqZWN0LmFzc2lnbihcbiAgICAgIHt9LFxuICAgICAge1xuICAgICAgICBzbGlkZXNUb1Njcm9sbDogMSxcbiAgICAgICAgc2xpZGVzVG9TaG93OiAxLFxuICAgICAgICByZXNpemVMb2NrOiB0cnVlLFxuICAgICAgICBkdXJhdGlvbjogMC41LFxuICAgICAgICAvLyBlYXNlSW5RdWFkXG4gICAgICAgIGVhc2luZzogZnVuY3Rpb24gKHgsIHQsIGIsIGMsIGQpIHtcbiAgICAgICAgICByZXR1cm4gYyAqICh0IC89IGQpICogdCArIGJcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHNldHRpbmdzXG4gICAgKVxuXG4gICAgLy8gc2V0IGRlZmF1bHRzXG4gICAgXy5hbmltYXRlX2lkID0gXy5wYWdlID0gXy5zbGlkZSA9IDBcbiAgICBfLmFycm93cyA9IHt9XG5cbiAgICAvLyBwcmVzZXJ2ZSBvcmlnaW5hbCBvcHRpb25zIHRvXG4gICAgLy8gZXh0ZW5kIGJyZWFrcG9pbnQgc2V0dGluZ3NcbiAgICBfLl9vcHQgPSBfLm9wdFxuXG4gICAgaWYgKF8ub3B0LnNraXBUcmFjaykge1xuICAgICAgLy8gZmlyc3QgYW5kIG9ubHkgY2hpbGQgaXMgdGhlIHRyYWNrXG4gICAgICBfLnRyYWNrID0gXy5lbGUuY2hpbGRyZW5bMF1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gY3JlYXRlIHRyYWNrIGFuZCB3cmFwIHNsaWRlc1xuICAgICAgXy50cmFjayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgICBfLmVsZS5hcHBlbmRDaGlsZChfLnRyYWNrKVxuICAgICAgd2hpbGUgKF8uZWxlLmNoaWxkcmVuLmxlbmd0aCAhPT0gMSkge1xuICAgICAgICBfLnRyYWNrLmFwcGVuZENoaWxkKF8uZWxlLmNoaWxkcmVuWzBdKVxuICAgICAgfVxuICAgIH1cblxuICAgIF8udHJhY2suY2xhc3NMaXN0LmFkZCgnZ2xpZGVyLXRyYWNrJylcblxuICAgIC8vIHN0YXJ0IGdsaWRlclxuICAgIF8uaW5pdCgpXG5cbiAgICAvLyBzZXQgZXZlbnRzXG4gICAgXy5yZXNpemUgPSBfLmluaXQuYmluZChfLCB0cnVlKVxuICAgIF8uZXZlbnQoXy5lbGUsICdhZGQnLCB7XG4gICAgICBzY3JvbGw6IF8udXBkYXRlQ29udHJvbHMuYmluZChfKVxuICAgIH0pXG4gICAgXy5ldmVudChfd2luZG93LCAnYWRkJywge1xuICAgICAgcmVzaXplOiBfLnJlc2l6ZVxuICAgIH0pXG4gIH0pXG5cbiAgdmFyIGdsaWRlclByb3RvdHlwZSA9IEdsaWRlci5wcm90b3R5cGVcbiAgZ2xpZGVyUHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAocmVmcmVzaCwgcGFnaW5nKSB7XG4gICAgdmFyIF8gPSB0aGlzXG5cbiAgICB2YXIgd2lkdGggPSAwXG5cbiAgICB2YXIgaGVpZ2h0ID0gMFxuXG4gICAgXy5zbGlkZXMgPSBfLnRyYWNrLmNoaWxkcmVuO1xuXG4gICAgW10uZm9yRWFjaC5jYWxsKF8uc2xpZGVzLCBmdW5jdGlvbiAoXywgaSkge1xuICAgICAgXy5jbGFzc0xpc3QuYWRkKCdnbGlkZXItc2xpZGUnKVxuICAgICAgXy5zZXRBdHRyaWJ1dGUoJ2RhdGEtZ3NsaWRlJywgaSlcbiAgICB9KVxuXG4gICAgXy5jb250YWluZXJXaWR0aCA9IF8uZWxlLmNsaWVudFdpZHRoXG5cbiAgICB2YXIgYnJlYWtwb2ludENoYW5nZWQgPSBfLnNldHRpbmdzQnJlYWtwb2ludCgpXG4gICAgaWYgKCFwYWdpbmcpIHBhZ2luZyA9IGJyZWFrcG9pbnRDaGFuZ2VkXG5cbiAgICBpZiAoXG4gICAgICBfLm9wdC5zbGlkZXNUb1Nob3cgPT09ICdhdXRvJyB8fFxuICAgICAgdHlwZW9mIF8ub3B0Ll9hdXRvU2xpZGUgIT09ICd1bmRlZmluZWQnXG4gICAgKSB7XG4gICAgICB2YXIgc2xpZGVDb3VudCA9IF8uY29udGFpbmVyV2lkdGggLyBfLm9wdC5pdGVtV2lkdGhcblxuICAgICAgXy5vcHQuX2F1dG9TbGlkZSA9IF8ub3B0LnNsaWRlc1RvU2hvdyA9IF8ub3B0LmV4YWN0V2lkdGhcbiAgICAgICAgPyBzbGlkZUNvdW50XG4gICAgICAgIDogTWF0aC5tYXgoMSwgTWF0aC5mbG9vcihzbGlkZUNvdW50KSlcbiAgICB9XG4gICAgaWYgKF8ub3B0LnNsaWRlc1RvU2Nyb2xsID09PSAnYXV0bycpIHtcbiAgICAgIF8ub3B0LnNsaWRlc1RvU2Nyb2xsID0gTWF0aC5mbG9vcihfLm9wdC5zbGlkZXNUb1Nob3cpXG4gICAgfVxuXG4gICAgXy5pdGVtV2lkdGggPSBfLm9wdC5leGFjdFdpZHRoXG4gICAgICA/IF8ub3B0Lml0ZW1XaWR0aFxuICAgICAgOiBfLmNvbnRhaW5lcldpZHRoIC8gXy5vcHQuc2xpZGVzVG9TaG93O1xuXG4gICAgLy8gc2V0IHNsaWRlIGRpbWVuc2lvbnNcbiAgICBbXS5mb3JFYWNoLmNhbGwoXy5zbGlkZXMsIGZ1bmN0aW9uIChfXykge1xuICAgICAgX18uc3R5bGUuaGVpZ2h0ID0gJ2F1dG8nXG4gICAgICBfXy5zdHlsZS53aWR0aCA9IF8uaXRlbVdpZHRoICsgJ3B4J1xuICAgICAgd2lkdGggKz0gXy5pdGVtV2lkdGhcbiAgICAgIGhlaWdodCA9IE1hdGgubWF4KF9fLm9mZnNldEhlaWdodCwgaGVpZ2h0KVxuICAgIH0pXG5cbiAgICBfLnRyYWNrLnN0eWxlLndpZHRoID0gd2lkdGggKyAncHgnXG4gICAgXy50cmFja1dpZHRoID0gd2lkdGhcbiAgICBfLmlzRHJhZyA9IGZhbHNlXG4gICAgXy5wcmV2ZW50Q2xpY2sgPSBmYWxzZVxuXG4gICAgXy5vcHQucmVzaXplTG9jayAmJiBfLnNjcm9sbFRvKF8uc2xpZGUgKiBfLml0ZW1XaWR0aCwgMClcblxuICAgIGlmIChicmVha3BvaW50Q2hhbmdlZCB8fCBwYWdpbmcpIHtcbiAgICAgIF8uYmluZEFycm93cygpXG4gICAgICBfLmJ1aWxkRG90cygpXG4gICAgICBfLmJpbmREcmFnKClcbiAgICB9XG5cbiAgICBfLnVwZGF0ZUNvbnRyb2xzKClcblxuICAgIF8uZW1pdChyZWZyZXNoID8gJ3JlZnJlc2gnIDogJ2xvYWRlZCcpXG4gIH1cblxuICBnbGlkZXJQcm90b3R5cGUuYmluZERyYWcgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIF8gPSB0aGlzXG4gICAgXy5tb3VzZSA9IF8ubW91c2UgfHwgXy5oYW5kbGVNb3VzZS5iaW5kKF8pXG5cbiAgICB2YXIgbW91c2V1cCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIF8ubW91c2VEb3duID0gdW5kZWZpbmVkXG4gICAgICBfLmVsZS5jbGFzc0xpc3QucmVtb3ZlKCdkcmFnJylcbiAgICAgIGlmIChfLmlzRHJhZykge1xuICAgICAgICBfLnByZXZlbnRDbGljayA9IHRydWVcbiAgICAgIH1cbiAgICAgIF8uaXNEcmFnID0gZmFsc2VcbiAgICB9XG5cbiAgICB2YXIgZXZlbnRzID0ge1xuICAgICAgbW91c2V1cDogbW91c2V1cCxcbiAgICAgIG1vdXNlbGVhdmU6IG1vdXNldXAsXG4gICAgICBtb3VzZWRvd246IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAgIF8ubW91c2VEb3duID0gZS5jbGllbnRYXG4gICAgICAgIF8uZWxlLmNsYXNzTGlzdC5hZGQoJ2RyYWcnKVxuICAgICAgfSxcbiAgICAgIG1vdXNlbW92ZTogXy5tb3VzZSxcbiAgICAgIGNsaWNrOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICBpZiAoXy5wcmV2ZW50Q2xpY2spIHtcbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAgIH1cbiAgICAgICAgXy5wcmV2ZW50Q2xpY2sgPSBmYWxzZVxuICAgICAgfVxuICAgIH1cblxuICAgIF8uZWxlLmNsYXNzTGlzdC50b2dnbGUoJ2RyYWdnYWJsZScsIF8ub3B0LmRyYWdnYWJsZSA9PT0gdHJ1ZSlcbiAgICBfLmV2ZW50KF8uZWxlLCAncmVtb3ZlJywgZXZlbnRzKVxuICAgIGlmIChfLm9wdC5kcmFnZ2FibGUpIF8uZXZlbnQoXy5lbGUsICdhZGQnLCBldmVudHMpXG4gIH1cblxuICBnbGlkZXJQcm90b3R5cGUuYnVpbGREb3RzID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBfID0gdGhpc1xuXG4gICAgaWYgKCFfLm9wdC5kb3RzKSB7XG4gICAgICBpZiAoXy5kb3RzKSBfLmRvdHMuaW5uZXJIVE1MID0gJydcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGlmICh0eXBlb2YgXy5vcHQuZG90cyA9PT0gJ3N0cmluZycpIHtcbiAgICAgIF8uZG90cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXy5vcHQuZG90cylcbiAgICB9IGVsc2UgXy5kb3RzID0gXy5vcHQuZG90c1xuICAgIGlmICghXy5kb3RzKSByZXR1cm5cblxuICAgIF8uZG90cy5pbm5lckhUTUwgPSAnJ1xuICAgIF8uZG90cy5jbGFzc0xpc3QuYWRkKCdnbGlkZXItZG90cycpXG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IE1hdGguY2VpbChfLnNsaWRlcy5sZW5ndGggLyBfLm9wdC5zbGlkZXNUb1Nob3cpOyArK2kpIHtcbiAgICAgIHZhciBkb3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKVxuICAgICAgZG90LmRhdGFzZXQuaW5kZXggPSBpXG4gICAgICBkb3Quc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgJ1BhZ2UgJyArIChpICsgMSkpXG4gICAgICBkb3Quc2V0QXR0cmlidXRlKCdyb2xlJywgJ3RhYicpXG4gICAgICBkb3QuY2xhc3NOYW1lID0gJ2dsaWRlci1kb3QgJyArIChpID8gJycgOiAnYWN0aXZlJylcbiAgICAgIF8uZXZlbnQoZG90LCAnYWRkJywge1xuICAgICAgICBjbGljazogXy5zY3JvbGxJdGVtLmJpbmQoXywgaSwgdHJ1ZSlcbiAgICAgIH0pXG4gICAgICBfLmRvdHMuYXBwZW5kQ2hpbGQoZG90KVxuICAgIH1cbiAgfVxuXG4gIGdsaWRlclByb3RvdHlwZS5iaW5kQXJyb3dzID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBfID0gdGhpc1xuICAgIGlmICghXy5vcHQuYXJyb3dzKSB7XG4gICAgICBPYmplY3Qua2V5cyhfLmFycm93cykuZm9yRWFjaChmdW5jdGlvbiAoZGlyZWN0aW9uKSB7XG4gICAgICAgIHZhciBlbGVtZW50ID0gXy5hcnJvd3NbZGlyZWN0aW9uXVxuICAgICAgICBfLmV2ZW50KGVsZW1lbnQsICdyZW1vdmUnLCB7IGNsaWNrOiBlbGVtZW50Ll9mdW5jIH0pXG4gICAgICB9KVxuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIFsncHJldicsICduZXh0J10uZm9yRWFjaChmdW5jdGlvbiAoZGlyZWN0aW9uKSB7XG4gICAgICB2YXIgYXJyb3cgPSBfLm9wdC5hcnJvd3NbZGlyZWN0aW9uXVxuICAgICAgaWYgKGFycm93KSB7XG4gICAgICAgIGlmICh0eXBlb2YgYXJyb3cgPT09ICdzdHJpbmcnKSBhcnJvdyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYXJyb3cpXG4gICAgICAgIGlmIChhcnJvdykge1xuICAgICAgICAgIGFycm93Ll9mdW5jID0gYXJyb3cuX2Z1bmMgfHwgXy5zY3JvbGxJdGVtLmJpbmQoXywgZGlyZWN0aW9uKVxuICAgICAgICAgIF8uZXZlbnQoYXJyb3csICdyZW1vdmUnLCB7XG4gICAgICAgICAgICBjbGljazogYXJyb3cuX2Z1bmNcbiAgICAgICAgICB9KVxuICAgICAgICAgIF8uZXZlbnQoYXJyb3csICdhZGQnLCB7XG4gICAgICAgICAgICBjbGljazogYXJyb3cuX2Z1bmNcbiAgICAgICAgICB9KVxuICAgICAgICAgIF8uYXJyb3dzW2RpcmVjdGlvbl0gPSBhcnJvd1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGdsaWRlclByb3RvdHlwZS51cGRhdGVDb250cm9scyA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgIHZhciBfID0gdGhpc1xuXG4gICAgaWYgKGV2ZW50ICYmICFfLm9wdC5zY3JvbGxQcm9wYWdhdGUpIHtcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG4gICAgfVxuXG4gICAgdmFyIGRpc2FibGVBcnJvd3MgPSBfLmNvbnRhaW5lcldpZHRoID49IF8udHJhY2tXaWR0aFxuXG4gICAgaWYgKCFfLm9wdC5yZXdpbmQpIHtcbiAgICAgIGlmIChfLmFycm93cy5wcmV2KSB7XG4gICAgICAgIF8uYXJyb3dzLnByZXYuY2xhc3NMaXN0LnRvZ2dsZShcbiAgICAgICAgICAnZGlzYWJsZWQnLFxuICAgICAgICAgIF8uZWxlLnNjcm9sbExlZnQgPD0gMCB8fCBkaXNhYmxlQXJyb3dzXG4gICAgICAgIClcbiAgICAgICAgXy5hcnJvd3MucHJldi5jbGFzc0xpc3QuY29udGFpbnMoJ2Rpc2FibGVkJylcbiAgICAgICAgICA/IF8uYXJyb3dzLnByZXYuc2V0QXR0cmlidXRlKCdhcmlhLWRpc2FibGVkJywgdHJ1ZSlcbiAgICAgICAgICA6IF8uYXJyb3dzLnByZXYuc2V0QXR0cmlidXRlKCdhcmlhLWRpc2FibGVkJywgZmFsc2UpXG4gICAgICB9XG4gICAgICBpZiAoXy5hcnJvd3MubmV4dCkge1xuICAgICAgICBfLmFycm93cy5uZXh0LmNsYXNzTGlzdC50b2dnbGUoXG4gICAgICAgICAgJ2Rpc2FibGVkJyxcbiAgICAgICAgICBNYXRoLmNlaWwoXy5lbGUuc2Nyb2xsTGVmdCArIF8uY29udGFpbmVyV2lkdGgpID49XG4gICAgICAgICAgICBNYXRoLmZsb29yKF8udHJhY2tXaWR0aCkgfHwgZGlzYWJsZUFycm93c1xuICAgICAgICApXG4gICAgICAgIF8uYXJyb3dzLm5leHQuY2xhc3NMaXN0LmNvbnRhaW5zKCdkaXNhYmxlZCcpXG4gICAgICAgICAgPyBfLmFycm93cy5uZXh0LnNldEF0dHJpYnV0ZSgnYXJpYS1kaXNhYmxlZCcsIHRydWUpXG4gICAgICAgICAgOiBfLmFycm93cy5uZXh0LnNldEF0dHJpYnV0ZSgnYXJpYS1kaXNhYmxlZCcsIGZhbHNlKVxuICAgICAgfVxuICAgIH1cblxuICAgIF8uc2xpZGUgPSBNYXRoLnJvdW5kKF8uZWxlLnNjcm9sbExlZnQgLyBfLml0ZW1XaWR0aClcbiAgICBfLnBhZ2UgPSBNYXRoLnJvdW5kKF8uZWxlLnNjcm9sbExlZnQgLyBfLmNvbnRhaW5lcldpZHRoKVxuXG4gICAgdmFyIG1pZGRsZSA9IF8uc2xpZGUgKyBNYXRoLmZsb29yKE1hdGguZmxvb3IoXy5vcHQuc2xpZGVzVG9TaG93KSAvIDIpXG5cbiAgICB2YXIgZXh0cmFNaWRkbGUgPSBNYXRoLmZsb29yKF8ub3B0LnNsaWRlc1RvU2hvdykgJSAyID8gMCA6IG1pZGRsZSArIDFcbiAgICBpZiAoTWF0aC5mbG9vcihfLm9wdC5zbGlkZXNUb1Nob3cpID09PSAxKSB7XG4gICAgICBleHRyYU1pZGRsZSA9IDBcbiAgICB9XG5cbiAgICAvLyB0aGUgbGFzdCBwYWdlIG1heSBiZSBsZXNzIHRoYW4gb25lIGhhbGYgb2YgYSBub3JtYWwgcGFnZSB3aWR0aCBzb1xuICAgIC8vIHRoZSBwYWdlIGlzIHJvdW5kZWQgZG93bi4gd2hlbiBhdCB0aGUgZW5kLCBmb3JjZSB0aGUgcGFnZSB0byB0dXJuXG4gICAgaWYgKF8uZWxlLnNjcm9sbExlZnQgKyBfLmNvbnRhaW5lcldpZHRoID49IE1hdGguZmxvb3IoXy50cmFja1dpZHRoKSkge1xuICAgICAgXy5wYWdlID0gXy5kb3RzID8gXy5kb3RzLmNoaWxkcmVuLmxlbmd0aCAtIDEgOiAwXG4gICAgfVxuXG4gICAgW10uZm9yRWFjaC5jYWxsKF8uc2xpZGVzLCBmdW5jdGlvbiAoc2xpZGUsIGluZGV4KSB7XG4gICAgICB2YXIgc2xpZGVDbGFzc2VzID0gc2xpZGUuY2xhc3NMaXN0XG5cbiAgICAgIHZhciB3YXNWaXNpYmxlID0gc2xpZGVDbGFzc2VzLmNvbnRhaW5zKCd2aXNpYmxlJylcblxuICAgICAgdmFyIHN0YXJ0ID0gXy5lbGUuc2Nyb2xsTGVmdFxuXG4gICAgICB2YXIgZW5kID0gXy5lbGUuc2Nyb2xsTGVmdCArIF8uY29udGFpbmVyV2lkdGhcblxuICAgICAgdmFyIGl0ZW1TdGFydCA9IF8uaXRlbVdpZHRoICogaW5kZXhcblxuICAgICAgdmFyIGl0ZW1FbmQgPSBpdGVtU3RhcnQgKyBfLml0ZW1XaWR0aDtcblxuICAgICAgW10uZm9yRWFjaC5jYWxsKHNsaWRlQ2xhc3NlcywgZnVuY3Rpb24gKGNsYXNzTmFtZSkge1xuICAgICAgICAvXmxlZnR8cmlnaHQvLnRlc3QoY2xhc3NOYW1lKSAmJiBzbGlkZUNsYXNzZXMucmVtb3ZlKGNsYXNzTmFtZSlcbiAgICAgIH0pXG4gICAgICBzbGlkZUNsYXNzZXMudG9nZ2xlKCdhY3RpdmUnLCBfLnNsaWRlID09PSBpbmRleClcbiAgICAgIGlmIChtaWRkbGUgPT09IGluZGV4IHx8IChleHRyYU1pZGRsZSAmJiBleHRyYU1pZGRsZSA9PT0gaW5kZXgpKSB7XG4gICAgICAgIHNsaWRlQ2xhc3Nlcy5hZGQoJ2NlbnRlcicpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzbGlkZUNsYXNzZXMucmVtb3ZlKCdjZW50ZXInKVxuICAgICAgICBzbGlkZUNsYXNzZXMuYWRkKFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIGluZGV4IDwgbWlkZGxlID8gJ2xlZnQnIDogJ3JpZ2h0JyxcbiAgICAgICAgICAgIE1hdGguYWJzKGluZGV4IC0gKGluZGV4IDwgbWlkZGxlID8gbWlkZGxlIDogZXh0cmFNaWRkbGUgfHwgbWlkZGxlKSlcbiAgICAgICAgICBdLmpvaW4oJy0nKVxuICAgICAgICApXG4gICAgICB9XG5cbiAgICAgIHZhciBpc1Zpc2libGUgPVxuICAgICAgICBNYXRoLmNlaWwoaXRlbVN0YXJ0KSA+PSBNYXRoLmZsb29yKHN0YXJ0KSAmJlxuICAgICAgICBNYXRoLmZsb29yKGl0ZW1FbmQpIDw9IE1hdGguY2VpbChlbmQpXG4gICAgICBzbGlkZUNsYXNzZXMudG9nZ2xlKCd2aXNpYmxlJywgaXNWaXNpYmxlKVxuICAgICAgaWYgKGlzVmlzaWJsZSAhPT0gd2FzVmlzaWJsZSkge1xuICAgICAgICBfLmVtaXQoJ3NsaWRlLScgKyAoaXNWaXNpYmxlID8gJ3Zpc2libGUnIDogJ2hpZGRlbicpLCB7XG4gICAgICAgICAgc2xpZGU6IGluZGV4XG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSlcbiAgICBpZiAoXy5kb3RzKSB7XG4gICAgICBbXS5mb3JFYWNoLmNhbGwoXy5kb3RzLmNoaWxkcmVuLCBmdW5jdGlvbiAoZG90LCBpbmRleCkge1xuICAgICAgICBkb3QuY2xhc3NMaXN0LnRvZ2dsZSgnYWN0aXZlJywgXy5wYWdlID09PSBpbmRleClcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgaWYgKGV2ZW50ICYmIF8ub3B0LnNjcm9sbExvY2spIHtcbiAgICAgIGNsZWFyVGltZW91dChfLnNjcm9sbExvY2spXG4gICAgICBfLnNjcm9sbExvY2sgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KF8uc2Nyb2xsTG9jaylcbiAgICAgICAgLy8gZG9udCBhdHRlbXB0IHRvIHNjcm9sbCBsZXNzIHRoYW4gYSBwaXhlbCBmcmFjdGlvbiAtIGNhdXNlcyBsb29waW5nXG4gICAgICAgIGlmIChNYXRoLmFicyhfLmVsZS5zY3JvbGxMZWZ0IC8gXy5pdGVtV2lkdGggLSBfLnNsaWRlKSA+IDAuMDIpIHtcbiAgICAgICAgICBpZiAoIV8ubW91c2VEb3duKSB7XG4gICAgICAgICAgICAvLyBPbmx5IHNjcm9sbCBpZiBub3QgYXQgdGhlIGVuZCAoIzk0KVxuICAgICAgICAgICAgaWYgKF8udHJhY2tXaWR0aCA+IF8uY29udGFpbmVyV2lkdGggKyBfLmVsZS5zY3JvbGxMZWZ0KSB7XG4gICAgICAgICAgICAgIF8uc2Nyb2xsSXRlbShfLmdldEN1cnJlbnRTbGlkZSgpKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSwgXy5vcHQuc2Nyb2xsTG9ja0RlbGF5IHx8IDI1MClcbiAgICB9XG4gIH1cblxuICBnbGlkZXJQcm90b3R5cGUuZ2V0Q3VycmVudFNsaWRlID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBfID0gdGhpc1xuICAgIHJldHVybiBfLnJvdW5kKF8uZWxlLnNjcm9sbExlZnQgLyBfLml0ZW1XaWR0aClcbiAgfVxuXG4gIGdsaWRlclByb3RvdHlwZS5zY3JvbGxJdGVtID0gZnVuY3Rpb24gKHNsaWRlLCBkb3QsIGUpIHtcbiAgICBpZiAoZSkgZS5wcmV2ZW50RGVmYXVsdCgpXG5cbiAgICB2YXIgXyA9IHRoaXNcblxuICAgIHZhciBvcmlnaW5hbFNsaWRlID0gc2xpZGVcbiAgICArK18uYW5pbWF0ZV9pZFxuXG4gICAgaWYgKGRvdCA9PT0gdHJ1ZSkge1xuICAgICAgc2xpZGUgPSBzbGlkZSAqIF8uY29udGFpbmVyV2lkdGhcbiAgICAgIHNsaWRlID0gTWF0aC5yb3VuZChzbGlkZSAvIF8uaXRlbVdpZHRoKSAqIF8uaXRlbVdpZHRoXG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0eXBlb2Ygc2xpZGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHZhciBiYWNrd2FyZHMgPSBzbGlkZSA9PT0gJ3ByZXYnXG5cbiAgICAgICAgLy8gdXNlIHByZWNpc2UgbG9jYXRpb24gaWYgZnJhY3Rpb25hbCBzbGlkZXMgYXJlIG9uXG4gICAgICAgIGlmIChfLm9wdC5zbGlkZXNUb1Njcm9sbCAlIDEgfHwgXy5vcHQuc2xpZGVzVG9TaG93ICUgMSkge1xuICAgICAgICAgIHNsaWRlID0gXy5nZXRDdXJyZW50U2xpZGUoKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNsaWRlID0gXy5zbGlkZVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGJhY2t3YXJkcykgc2xpZGUgLT0gXy5vcHQuc2xpZGVzVG9TY3JvbGxcbiAgICAgICAgZWxzZSBzbGlkZSArPSBfLm9wdC5zbGlkZXNUb1Njcm9sbFxuXG4gICAgICAgIGlmIChfLm9wdC5yZXdpbmQpIHtcbiAgICAgICAgICB2YXIgc2Nyb2xsTGVmdCA9IF8uZWxlLnNjcm9sbExlZnRcbiAgICAgICAgICBzbGlkZSA9XG4gICAgICAgICAgICBiYWNrd2FyZHMgJiYgIXNjcm9sbExlZnRcbiAgICAgICAgICAgICAgPyBfLnNsaWRlcy5sZW5ndGhcbiAgICAgICAgICAgICAgOiAhYmFja3dhcmRzICYmXG4gICAgICAgICAgICAgICAgc2Nyb2xsTGVmdCArIF8uY29udGFpbmVyV2lkdGggPj0gTWF0aC5mbG9vcihfLnRyYWNrV2lkdGgpXG4gICAgICAgICAgICAgICAgPyAwXG4gICAgICAgICAgICAgICAgOiBzbGlkZVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHNsaWRlID0gTWF0aC5tYXgoTWF0aC5taW4oc2xpZGUsIF8uc2xpZGVzLmxlbmd0aCksIDApXG5cbiAgICAgIF8uc2xpZGUgPSBzbGlkZVxuICAgICAgc2xpZGUgPSBfLml0ZW1XaWR0aCAqIHNsaWRlXG4gICAgfVxuXG4gICAgXy5zY3JvbGxUbyhcbiAgICAgIHNsaWRlLFxuICAgICAgXy5vcHQuZHVyYXRpb24gKiBNYXRoLmFicyhfLmVsZS5zY3JvbGxMZWZ0IC0gc2xpZGUpLFxuICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICBfLnVwZGF0ZUNvbnRyb2xzKClcbiAgICAgICAgXy5lbWl0KCdhbmltYXRlZCcsIHtcbiAgICAgICAgICB2YWx1ZTogb3JpZ2luYWxTbGlkZSxcbiAgICAgICAgICB0eXBlOlxuICAgICAgICAgICAgdHlwZW9mIG9yaWdpbmFsU2xpZGUgPT09ICdzdHJpbmcnID8gJ2Fycm93JyA6IGRvdCA/ICdkb3QnIDogJ3NsaWRlJ1xuICAgICAgICB9KVxuICAgICAgfVxuICAgIClcblxuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgZ2xpZGVyUHJvdG90eXBlLnNldHRpbmdzQnJlYWtwb2ludCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgXyA9IHRoaXNcblxuICAgIHZhciByZXNwID0gXy5fb3B0LnJlc3BvbnNpdmVcblxuICAgIGlmIChyZXNwKSB7XG4gICAgICAvLyBTb3J0IHRoZSBicmVha3BvaW50cyBpbiBtb2JpbGUgZmlyc3Qgb3JkZXJcbiAgICAgIHJlc3Auc29ydChmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICByZXR1cm4gYi5icmVha3BvaW50IC0gYS5icmVha3BvaW50XG4gICAgICB9KVxuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlc3AubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgdmFyIHNpemUgPSByZXNwW2ldXG4gICAgICAgIGlmIChfd2luZG93LmlubmVyV2lkdGggPj0gc2l6ZS5icmVha3BvaW50KSB7XG4gICAgICAgICAgaWYgKF8uYnJlYWtwb2ludCAhPT0gc2l6ZS5icmVha3BvaW50KSB7XG4gICAgICAgICAgICBfLm9wdCA9IE9iamVjdC5hc3NpZ24oe30sIF8uX29wdCwgc2l6ZS5zZXR0aW5ncylcbiAgICAgICAgICAgIF8uYnJlYWtwb2ludCA9IHNpemUuYnJlYWtwb2ludFxuICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgLy8gc2V0IGJhY2sgdG8gZGVmYXVsdHMgaW4gY2FzZSB0aGV5IHdlcmUgb3ZlcnJpZGVuXG4gICAgdmFyIGJyZWFrcG9pbnRDaGFuZ2VkID0gXy5icmVha3BvaW50ICE9PSAwXG4gICAgXy5vcHQgPSBPYmplY3QuYXNzaWduKHt9LCBfLl9vcHQpXG4gICAgXy5icmVha3BvaW50ID0gMFxuICAgIHJldHVybiBicmVha3BvaW50Q2hhbmdlZFxuICB9XG5cbiAgZ2xpZGVyUHJvdG90eXBlLnNjcm9sbFRvID0gZnVuY3Rpb24gKHNjcm9sbFRhcmdldCwgc2Nyb2xsRHVyYXRpb24sIGNhbGxiYWNrKSB7XG4gICAgdmFyIF8gPSB0aGlzXG5cbiAgICB2YXIgc3RhcnQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKVxuXG4gICAgdmFyIGFuaW1hdGVJbmRleCA9IF8uYW5pbWF0ZV9pZFxuXG4gICAgdmFyIGFuaW1hdGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgbm93ID0gbmV3IERhdGUoKS5nZXRUaW1lKCkgLSBzdGFydFxuICAgICAgXy5lbGUuc2Nyb2xsTGVmdCA9XG4gICAgICAgIF8uZWxlLnNjcm9sbExlZnQgK1xuICAgICAgICAoc2Nyb2xsVGFyZ2V0IC0gXy5lbGUuc2Nyb2xsTGVmdCkgKlxuICAgICAgICAgIF8ub3B0LmVhc2luZygwLCBub3csIDAsIDEsIHNjcm9sbER1cmF0aW9uKVxuICAgICAgaWYgKG5vdyA8IHNjcm9sbER1cmF0aW9uICYmIGFuaW1hdGVJbmRleCA9PT0gXy5hbmltYXRlX2lkKSB7XG4gICAgICAgIF93aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW1hdGUpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBfLmVsZS5zY3JvbGxMZWZ0ID0gc2Nyb2xsVGFyZ2V0XG4gICAgICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrLmNhbGwoXylcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShhbmltYXRlKVxuICB9XG5cbiAgZ2xpZGVyUHJvdG90eXBlLnJlbW92ZUl0ZW0gPSBmdW5jdGlvbiAoaW5kZXgpIHtcbiAgICB2YXIgXyA9IHRoaXNcblxuICAgIGlmIChfLnNsaWRlcy5sZW5ndGgpIHtcbiAgICAgIF8udHJhY2sucmVtb3ZlQ2hpbGQoXy5zbGlkZXNbaW5kZXhdKVxuICAgICAgXy5yZWZyZXNoKHRydWUpXG4gICAgICBfLmVtaXQoJ3JlbW92ZScpXG4gICAgfVxuICB9XG5cbiAgZ2xpZGVyUHJvdG90eXBlLmFkZEl0ZW0gPSBmdW5jdGlvbiAoZWxlKSB7XG4gICAgdmFyIF8gPSB0aGlzXG5cbiAgICBfLnRyYWNrLmFwcGVuZENoaWxkKGVsZSlcbiAgICBfLnJlZnJlc2godHJ1ZSlcbiAgICBfLmVtaXQoJ2FkZCcpXG4gIH1cblxuICBnbGlkZXJQcm90b3R5cGUuaGFuZGxlTW91c2UgPSBmdW5jdGlvbiAoZSkge1xuICAgIHZhciBfID0gdGhpc1xuICAgIGlmIChfLm1vdXNlRG93bikge1xuICAgICAgXy5pc0RyYWcgPSB0cnVlXG4gICAgICBfLmVsZS5zY3JvbGxMZWZ0ICs9XG4gICAgICAgIChfLm1vdXNlRG93biAtIGUuY2xpZW50WCkgKiAoXy5vcHQuZHJhZ1ZlbG9jaXR5IHx8IDMuMylcbiAgICAgIF8ubW91c2VEb3duID0gZS5jbGllbnRYXG4gICAgfVxuICB9XG5cbiAgLy8gdXNlZCB0byByb3VuZCB0byB0aGUgbmVhcmVzdCAwLlhYIGZyYWN0aW9uXG4gIGdsaWRlclByb3RvdHlwZS5yb3VuZCA9IGZ1bmN0aW9uIChkb3VibGUpIHtcbiAgICB2YXIgXyA9IHRoaXNcbiAgICB2YXIgc3RlcCA9IF8ub3B0LnNsaWRlc1RvU2Nyb2xsICUgMSB8fCAxXG4gICAgdmFyIGludiA9IDEuMCAvIHN0ZXBcbiAgICByZXR1cm4gTWF0aC5yb3VuZChkb3VibGUgKiBpbnYpIC8gaW52XG4gIH1cblxuICBnbGlkZXJQcm90b3R5cGUucmVmcmVzaCA9IGZ1bmN0aW9uIChwYWdpbmcpIHtcbiAgICB2YXIgXyA9IHRoaXNcbiAgICBfLmluaXQodHJ1ZSwgcGFnaW5nKVxuICB9XG5cbiAgZ2xpZGVyUHJvdG90eXBlLnNldE9wdGlvbiA9IGZ1bmN0aW9uIChvcHQsIGdsb2JhbCkge1xuICAgIHZhciBfID0gdGhpc1xuXG4gICAgaWYgKF8uYnJlYWtwb2ludCAmJiAhZ2xvYmFsKSB7XG4gICAgICBfLl9vcHQucmVzcG9uc2l2ZS5mb3JFYWNoKGZ1bmN0aW9uICh2KSB7XG4gICAgICAgIGlmICh2LmJyZWFrcG9pbnQgPT09IF8uYnJlYWtwb2ludCkge1xuICAgICAgICAgIHYuc2V0dGluZ3MgPSBPYmplY3QuYXNzaWduKHt9LCB2LnNldHRpbmdzLCBvcHQpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSBlbHNlIHtcbiAgICAgIF8uX29wdCA9IE9iamVjdC5hc3NpZ24oe30sIF8uX29wdCwgb3B0KVxuICAgIH1cblxuICAgIF8uYnJlYWtwb2ludCA9IDBcbiAgICBfLnNldHRpbmdzQnJlYWtwb2ludCgpXG4gIH1cblxuICBnbGlkZXJQcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgXyA9IHRoaXNcblxuICAgIHZhciByZXBsYWNlID0gXy5lbGUuY2xvbmVOb2RlKHRydWUpXG5cbiAgICB2YXIgY2xlYXIgPSBmdW5jdGlvbiAoZWxlKSB7XG4gICAgICBlbGUucmVtb3ZlQXR0cmlidXRlKCdzdHlsZScpO1xuICAgICAgW10uZm9yRWFjaC5jYWxsKGVsZS5jbGFzc0xpc3QsIGZ1bmN0aW9uIChjbGFzc05hbWUpIHtcbiAgICAgICAgL15nbGlkZXIvLnRlc3QoY2xhc3NOYW1lKSAmJiBlbGUuY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWUpXG4gICAgICB9KVxuICAgIH1cbiAgICAvLyByZW1vdmUgdHJhY2tcbiAgICByZXBsYWNlLmNoaWxkcmVuWzBdLm91dGVySFRNTCA9IHJlcGxhY2UuY2hpbGRyZW5bMF0uaW5uZXJIVE1MXG4gICAgY2xlYXIocmVwbGFjZSk7XG4gICAgW10uZm9yRWFjaC5jYWxsKHJlcGxhY2UuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJyonKSwgY2xlYXIpXG4gICAgXy5lbGUucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQocmVwbGFjZSwgXy5lbGUpXG4gICAgXy5ldmVudChfd2luZG93LCAncmVtb3ZlJywge1xuICAgICAgcmVzaXplOiBfLnJlc2l6ZVxuICAgIH0pXG4gICAgXy5lbWl0KCdkZXN0cm95JylcbiAgfVxuXG4gIGdsaWRlclByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24gKG5hbWUsIGFyZykge1xuICAgIHZhciBfID0gdGhpc1xuXG4gICAgdmFyIGUgPSBuZXcgX3dpbmRvdy5DdXN0b21FdmVudCgnZ2xpZGVyLScgKyBuYW1lLCB7XG4gICAgICBidWJibGVzOiAhXy5vcHQuZXZlbnRQcm9wYWdhdGUsXG4gICAgICBkZXRhaWw6IGFyZ1xuICAgIH0pXG4gICAgXy5lbGUuZGlzcGF0Y2hFdmVudChlKVxuICB9XG5cbiAgZ2xpZGVyUHJvdG90eXBlLmV2ZW50ID0gZnVuY3Rpb24gKGVsZSwgdHlwZSwgYXJncykge1xuICAgIHZhciBldmVudEhhbmRsZXIgPSBlbGVbdHlwZSArICdFdmVudExpc3RlbmVyJ10uYmluZChlbGUpXG4gICAgT2JqZWN0LmtleXMoYXJncykuZm9yRWFjaChmdW5jdGlvbiAoaykge1xuICAgICAgZXZlbnRIYW5kbGVyKGssIGFyZ3Nba10pXG4gICAgfSlcbiAgfVxuXG4gIHJldHVybiBHbGlkZXJcbn0pXG4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0EsZUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0EiLCJzb3VyY2VSb290IjoiIn0=