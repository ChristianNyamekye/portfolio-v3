import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ProjectDetail from '@/components/ProjectDetail'
import PageTransition from '@/components/PageTransition'
import AIAssistant from '@/components/AIAssistant'
import { featuredProjects, meta } from '@/lib/data'

const slugMap: Record<string, string> = {
  flexa: 'flexa',
  garb: 'garb',
  quadsense: 'quadsense',
}

export function generateStaticParams() {
  return Object.keys(slugMap).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const projectId = slugMap[slug]
  if (!projectId) return {}

  const project = featuredProjects.find((p) => p.id === projectId)
  if (!project) return {}

  const title = `${project.name} — Christian Nyamekye`
  const description = project.tagline

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${meta.url}/projects/${slug}`,
      type: 'article',
      images: [{ url: `${meta.url}/og.jpg`, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: '@printlnxristian',
    },
  }
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const projectId = slugMap[slug]
  if (!projectId) notFound()

  const project = featuredProjects.find((p) => p.id === projectId)
  if (!project) notFound()

  return (
    <PageTransition>
      <ProjectDetail project={project} />
      <AIAssistant />
    </PageTransition>
  )
}
