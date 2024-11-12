import {DateTime} from 'luxon'
import {nextTick} from 'vue'

export function putFocusNextTick(id, cssSelector?) {
  const callable = () => {
      let el = document.getElementById(id)
      el = el && cssSelector ? el.querySelector(cssSelector) : el
      el && el.focus()
      return !!el
  }
  nextTick(() => {
    let counter = 0
    const job = setInterval(() => (callable() || ++counter > 3) && clearInterval(job), 500)
  })
}

// eslint-disable-next-line no-undef
export function scrollTo(anchor: string, scrollBlock?: ScrollLogicalPosition) {
  nextTick(() => {
    const element = document.getElementById(anchor)
    if (element) {
      element.classList.add('scroll-margins')
      element.scrollIntoView({behavior: 'smooth', block: scrollBlock || 'center'})
    }
  })
}

export function scrollToTop() {
  scrollTo('content', 'start')
}

export function toFormatFromJsDate(jsDate: Date, format: string): string {
  // See https://moment.github.io/luxon/#/formatting?id=table-of-tokens
  return DateTime.fromJSDate(jsDate).toFormat(format)
}

export function toFormatFromISO(isoString: string, format: string): string {
  // See https://moment.github.io/luxon/#/formatting?id=table-of-tokens
  return DateTime.fromISO(isoString).toFormat(format)
}

export function toLocaleFromISO(isoString: string, luxonPreset?: any): string {
  // See https://moment.github.io/luxon/#/formatting?id=presets
  return DateTime.fromISO(isoString).toLocaleString(luxonPreset || DateTime.DATE_MED)
}
