// Onboarding requires user auth — not applicable in boilerplate demo
import { redirect } from 'next/navigation'
export default function OnboardingPage() { redirect('/') }
