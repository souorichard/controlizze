import { PropsWithChildren } from 'react'

import {
  Container,
  HeaderContainer,
  MainContainer,
} from '@/components/container'
import { Header } from '@/components/header'

import { ProfileNavigation } from './_components/profile-navigation'

export default async function ProfileLayout({ children }: PropsWithChildren) {
  return (
    <Container>
      <HeaderContainer className="pb-5">
        <Header />
      </HeaderContainer>
      <MainContainer>
        <h1 className="text-xl font-semibold md:text-2xl">Your profile</h1>
        <div className="flex flex-col gap-10 lg:flex-row">
          <ProfileNavigation />
          {children}
        </div>
      </MainContainer>
    </Container>
  )
}
