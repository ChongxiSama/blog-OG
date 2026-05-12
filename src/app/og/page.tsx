import { Container, Box } from '@mui/material'

type SearchParams = {
  title?: string
  date?: string
  tag?: string
  license?: string
}

export default async function OgPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const resolved = await searchParams
  const params = new URLSearchParams()
  if (resolved.title) params.set('title', resolved.title)
  if (resolved.date) params.set('date', resolved.date)
  if (resolved.tag) params.set('tag', resolved.tag)
  if (resolved.license) params.set('license', resolved.license)

  const query = params.toString()
  const ogUrl = query ? `/api/og?${query}` : '/api/og'

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box
        sx={{
          width: '100%',
          aspectRatio: '16 / 9',
          borderRadius: 2,
          overflow: 'hidden',
          bgcolor: 'grey.100',
        }}
      >
        <img
          src={ogUrl}
          alt="OG"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </Box>
    </Container>
  )
}
