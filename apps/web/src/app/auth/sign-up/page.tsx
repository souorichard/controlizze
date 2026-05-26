import Image from 'next/image'
import Link from 'next/link'
import githubIcon from '@/assets/icons/github-icon.svg'
import googleIcon from '@/assets/icons/google-icon.svg'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

export default function SignUpPage() {
  return (
    <div className="max-w-lg w-full space-y-12">
      <div className="space-y-2">
        <h1 className="text-4xl font-medium font-heading tracking-wide">
          Controle financeiro <br /> simples, claro e eficiente
        </h1>
        <p className="text-muted-foreground">
          Organize suas finanças, acompanhe resultados em tempo real e tome
          decisões com segurança
        </p>
      </div>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button size="lg" variant="outline" className="h-10 flex-1">
            <Image src={googleIcon} alt="Google" className="size-4" />
            Continuar com Google
          </Button>
          <Button size="lg" variant="outline" className="h-10 flex-1">
            <Image src={githubIcon} alt="Github" className="size-4" />
            Continuar com Github
          </Button>
        </div>
        <div className="flex items-center gap-4">
          <Separator className="flex-1" />
          <span className="text-sm text-muted-foreground">
            ou com seu email
          </span>
          <Separator className="flex-1" />
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Nome</Label>
            <Input type="text" placeholder="John Doe" className="h-10" />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="john@exemplo.com"
              className="h-10"
            />
          </div>
          <div className="space-y-2">
            <Label>Senha</Label>
            <Input
              type="password"
              placeholder="Digite sua senha"
              className="h-10"
            />
          </div>
          <div className="space-y-2">
            <Label>Confirmar senha</Label>
            <Input
              type="password"
              placeholder="Digite sua senha novamente"
              className="h-10"
            />
          </div>
          <Button size="lg" className="w-full h-10">
            Criar nova conta
          </Button>
        </div>
        <p className="text-sm text-muted-foreground text-center">
          Já tem uma conta?{' '}
          <Link
            href="/auth/sign-in"
            className="text-primary transition-colors hover:text-primary/85"
          >
            Acesse!
          </Link>
        </p>
      </div>
    </div>
  )
}
