import { Metadata } from 'next'

import {
  Container,
  HeaderContainer,
  MainContainer,
} from '@/components/container'
import { Header } from '@/components/header'

export const metadata: Metadata = {
  title: 'Dashboard',
}

export default async function Home() {
  return (
    <Container>
      <HeaderContainer className="border-none pb-5">
        <Header />
      </HeaderContainer>
      <MainContainer>asd</MainContainer>
    </Container>
  )
}
