import {
  Container,
  HeaderContainer,
  MainContainer,
} from '@/components/container'
import { Header } from '@/components/header'
import { OrganizationForm } from '@/components/organization-form'

export default function CreateOrganizationPage() {
  return (
    <Container>
      <HeaderContainer className="pb-5">
        <Header />
      </HeaderContainer>
      <MainContainer>
        <h1 className="text-2xl font-semibold">Create organization</h1>

        <OrganizationForm />
      </MainContainer>
    </Container>
  )
}
