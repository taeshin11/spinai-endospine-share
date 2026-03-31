interface TrackingData {
  event: string
  email?: string
  name?: string
  specialty?: string
  institution?: string
  videoTitle?: string
  videoCategory?: string
}

export const trackEvent = async (eventData: TrackingData) => {
  const webhookUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL
  if (!webhookUrl || webhookUrl === 'your_apps_script_webhook_url') return

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: eventData.event,
        email: eventData.email || '',
        name: eventData.name || '',
        specialty: eventData.specialty || '',
        institution: eventData.institution || '',
        videoTitle: eventData.videoTitle || '',
        videoCategory: eventData.videoCategory || '',
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
        referrer: typeof document !== 'undefined' ? document.referrer : '',
        page: typeof window !== 'undefined' ? window.location.pathname : '',
      }),
    })
  } catch {
    // Silent fail — do not disrupt UX
  }
}
