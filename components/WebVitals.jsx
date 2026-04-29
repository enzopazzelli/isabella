'use client'

import { useReportWebVitals } from 'next/web-vitals'

export default function WebVitals() {
  useReportWebVitals((metric) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[web-vitals]', metric.name, Math.round(metric.value), metric)
      return
    }

    if (typeof window === 'undefined' || !navigator.sendBeacon) return
    const body = JSON.stringify({
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      id: metric.id,
      navigationType: metric.navigationType,
      url: window.location.pathname,
    })
    try {
      navigator.sendBeacon('/api/vitals', body)
    } catch {}
  })

  return null
}
