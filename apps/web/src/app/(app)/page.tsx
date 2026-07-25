import type { Metadata } from 'next'
import { AnimatedBackground } from '@/components/animated-background'
import {
  Container,
  ContainerHeader,
  ContainerMain,
} from '@/components/container'
import { Header } from '@/components/header'
import { HomeWrapper } from './_components/home-wrapper'

export const metadata: Metadata = {
  title: 'Home',
}

export default function HomePage() {
  return (
    <Container className="flex flex-col">
      <AnimatedBackground variant="hero" />

      <ContainerHeader className="pb-5">
        <Header />
      </ContainerHeader>

      <ContainerMain className="flex flex-1 flex-col items-center justify-center gap-10">
        <HomeWrapper />
      </ContainerMain>
    </Container>
  )
}
