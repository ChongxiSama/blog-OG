'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
  Paper,
} from '@mui/material'

interface ScrapedData {
  title: string
  date: string
  license: string
  tag: string
}

export default function Home() {
  const router = useRouter()
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event?: React.FormEvent) => {
    event?.preventDefault()
    if (!url.trim()) {
      return
    }
    setLoading(true)
    try {
      const scrapeResponse = await fetch(
        `/api/scrape?url=${encodeURIComponent(url)}`
      )
      if (!scrapeResponse.ok) {
        throw new Error('Failed to scrape URL')
      }
      const data: ScrapedData = await scrapeResponse.json()
      const params = new URLSearchParams({
        title: data.title,
        date: data.date,
        tag: data.tag,
        license: data.license,
      })
      router.push(`/og?${params.toString()}`)
    } catch (error) {
      console.error(error)
      alert('Failed to fetch OG data')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Stack spacing={3} component="form" onSubmit={handleSubmit}>
        <Typography variant="h4" component="h1" fontWeight={700}>
          OG test
        </Typography>
        <TextField
          fullWidth
          placeholder="https://xice.cx/posts/example/"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          disabled={loading}
        />
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Stack spacing={1}>
            <Typography variant="subtitle2" fontWeight={600}>
              API 使用示例
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
              /api/og?title=TITLE&date=2025.05.12&tag=DOCUMENT&license=CC%20BY-NC-SA%204.0
            </Typography>
            <Typography variant="body2" color="text.secondary">
              也可以先用 /api/scrape?url=文章地址 获取参数，再拼接到 /api/og
            </Typography>
          </Stack>
        </Paper>
        <Box>
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
          >
            Confirm
          </Button>
        </Box>
      </Stack>
    </Container>
  )
}
