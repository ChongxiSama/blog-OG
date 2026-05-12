import { redirect } from 'next/navigation'

type SearchParams = {
  title?: string | string[]
  date?: string | string[]
  tag?: string | string[]
  license?: string | string[]
}

export default async function OgPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const resolved = await searchParams
  const params = new URLSearchParams()
  const pick = (value?: string | string[]) =>
    Array.isArray(value) ? value[0] : value

  const title = pick(resolved.title)
  const date = pick(resolved.date)
  const tag = pick(resolved.tag)
  const license = pick(resolved.license)

  if (title) params.set('title', title)
  if (date) params.set('date', date)
  if (tag) params.set('tag', tag)
  if (license) params.set('license', license)

  const query = params.toString()
  const ogUrl = query ? `/api/og?${query}` : '/api/og'

  redirect(ogUrl)
}
