import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShieldAlert, 
  Binary, 
  Code2, 
  Layout as LayoutIcon, 
  Zap, 
  Cpu, 
  Search, 
  ArrowRight, 
  ChevronRight,
  Download,
  History
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { IMAGES } from '@/assets/images';
import { ROUTE_PATHS } from '@/lib/index';

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
              <Binary className="text-primary w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-xl tracking-tight text-foreground">IDR <span className="text-primary">Web Edition</span></h1>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Interactive Delphi Reconstructor</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Recursos</a>
            <a href="#versions" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Suporte</a>
            <Link to={ROUTE_PATHS.WORKSPACE}>
              <Button size="sm" className="gap-2">
                Abrir Workspace <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src={IMAGES.SECURITY_RESEARCH_20260220_015613_5} 
              alt="Security Research Background" 
              className="w-full h-full object-cover opacity-10"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <Badge variant="outline" className="mb-4 border-primary/30 text-primary bg-primary/5">
                  Versão 2026 — Web Cloud Interface
                </Badge>
                <h2 className="text-4xl lg:text-6xl font-extrabold tracking-tight text-foreground mb-6 leading-tight">
                  Engenharia Reversa Delphi de <span className="text-primary">Próxima Geração</span>
                </h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-xl leading-relaxed">
                  A recriação moderna do lendário Interactive Delphi Reconstructor. Analise binários EXE/DLL, recupere unidades, classes VMT, strings e formulários DFM com precisão forense.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to={ROUTE_PATHS.WORKSPACE}>
                    <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg gap-2 shadow-lg shadow-primary/20">
                      Iniciar Decompilação <Zap className="w-5 h-5" />
                    </Button>
                  </Link>
                  <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 px-8 text-lg gap-2">
                    Ver Documentação <Search className="w-5 h-5" />
                  </Button>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <div className="relative rounded-xl overflow-hidden border border-border/50 shadow-2xl">
                  <img 
                    src={IMAGES.DECOMPILATION_PROCESS_20260220_015612_6} 
                    alt="Interface Preview" 
                    className="w-full h-auto"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-transparent pointer-events-none" />
                </div>
                {/* Floating Elements */}
                <div className="absolute -bottom-6 -left-6 bg-card border border-border p-4 rounded-lg shadow-xl hidden md:block">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs font-mono">Delphi XE4 Detectado</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Ethics & Legal Notice */}
        <section className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Alert variant="destructive" className="bg-destructive/5 border-destructive/20">
              <ShieldAlert className="h-5 w-5" />
              <AlertTitle className="font-bold">Aviso de Uso Responsável</AlertTitle>
              <AlertDescription className="text-muted-foreground">
                Esta ferramenta é destinada exclusivamente para pesquisa acadêmica, análise de segurança, engenharia reversa para fins educacionais e recuperação de código próprio. O uso indevido para atividades ilegais é de total responsabilidade do usuário.
              </AlertDescription>
            </Alert>
          </motion.div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h3 className="text-3xl font-bold mb-4">Funcionalidades Avançadas</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Tudo o que você precisa para desmontar e entender binários compilados em Delphi, agora direto no seu navegador.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[ 
                {
                  icon: <Cpu className="w-8 h-8 text-primary" />,
                  title: "Reconstrução de VMT",
                  desc: "Mapeamento completo de hierarquia de classes, métodos virtuais, dinâmicos e tabelas RTTI."
                },
                {
                  icon: <Code2 className="w-8 h-8 text-primary" />,
                  title: "Editor Monaco",
                  desc: "Editor profissional integrado com syntax highlighting Pascal e Assembly para análise profunda."
                },
                {
                  icon: <LayoutIcon className="w-8 h-8 text-primary" />,
                  title: "Designer Visual DFM",
                  desc: "Visualize e edite formulários Delphi visualmente. Altere propriedades e veja o código DFM em tempo real."
                },
                {
                  icon: <History className="w-8 h-8 text-primary" />,
                  title: "Patching de Binário",
                  desc: "Altere strings, recursos e código, e recompile o executável mantendo a fidelidade ao original."
                }
              ].map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full border-border/50 hover:border-primary/50 transition-colors group">
                    <CardHeader>
                      <div className="mb-4 p-3 rounded-xl bg-primary/5 w-fit group-hover:bg-primary/10 transition-colors">
                        {feature.icon}
                      </div>
                      <CardTitle>{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-sm leading-relaxed">
                        {feature.desc}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Support Versions Section */}
        <section id="versions" className="py-24">
          <div className="container mx-auto px-4">
            <div className="bg-card border border-border rounded-3xl p-8 lg:p-16 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-1/3 h-full opacity-5 pointer-events-none">
                <img src={IMAGES.IDR_LOGO_20260220_015613_1} alt="Logo BG" className="w-full h-full object-contain" />
              </div>

              <div className="relative z-10">
                <h3 className="text-3xl font-bold mb-6">Amplo Suporte a Versões Delphi</h3>
                <p className="text-muted-foreground mb-10 max-w-2xl">
                  O IDR Web Edition utiliza bases de conhecimento (KB) extensas para identificar assinaturas de compiladores desde o legado Delphi 2 até o moderno Delphi XE4.
                </p>
                
                <div className="flex flex-wrap gap-3">
                  {["Delphi 2", "3", "4", "5", "6", "7", "2005", "2006", "2007", "2009", "2010", "XE1", "XE2", "XE3", "XE4"].map((v) => (
                    <Badge key={v} variant="secondary" className="px-4 py-2 font-mono text-sm">
                      {v.includes("Delphi") ? v : `Delphi ${v}`}
                    </Badge>
                  ))}
                  <Badge variant="outline" className="px-4 py-2 border-primary/40 text-primary">
                    Detecção Automática
                  </Badge>
                </div>

                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-border/50">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 p-2 bg-primary/10 rounded-lg"><Download className="w-5 h-5 text-primary" /></div>
                    <div>
                      <h4 className="font-bold mb-1">Exportação de Projeto</h4>
                      <p className="text-sm text-muted-foreground">Gere projetos .dpr completos prontos para compilar.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="mt-1 p-2 bg-primary/10 rounded-lg"><Search className="w-5 h-5 text-primary" /></div>
                    <div>
                      <h4 className="font-bold mb-1">Análise de Strings</h4>
                      <p className="text-sm text-muted-foreground">Localize mensagens e referências cruzadas instantaneamente.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="mt-1 p-2 bg-primary/10 rounded-lg"><Zap className="w-5 h-5 text-primary" /></div>
                    <div>
                      <h4 className="font-bold mb-1">Alta Performance</h4>
                      <p className="text-sm text-muted-foreground">Backend otimizado para processar binários de grande porte.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto bg-primary rounded-3xl p-12 text-primary-foreground shadow-2xl shadow-primary/30 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent)]" />
              <h3 className="text-4xl font-bold mb-6 relative z-10">Pronto para explorar o código?</h3>
              <p className="text-primary-foreground/80 mb-8 text-lg relative z-10">
                Carregue seu executável Delphi agora e comece a reconstruir sua estrutura lógica em segundos.
              </p>
              <Link to={ROUTE_PATHS.WORKSPACE} className="relative z-10">
                <Button size="lg" variant="secondary" className="h-14 px-10 text-lg gap-2 group">
                  Acessar Ferramenta <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/40 py-12 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-col items-center md:items-start gap-4">
              <div className="flex items-center gap-2">
                <Binary className="text-primary w-5 h-5" />
                <span className="font-bold text-lg">IDR Web Edition</span>
              </div>
              <p className="text-sm text-muted-foreground max-w-xs text-center md:text-left">
                Engenharia reversa inteligente para profissionais de segurança e entusiastas Delphi.
              </p>
            </div>
            <div className="flex gap-12">
              <div className="flex flex-col gap-3">
                <span className="font-semibold text-sm uppercase tracking-wider text-foreground">Produto</span>
                <a href="#features" className="text-sm text-muted-foreground hover:text-primary transition-colors">Recursos</a>
                <a href="#versions" className="text-sm text-muted-foreground hover:text-primary transition-colors">Compatibilidade</a>
                <Link to={ROUTE_PATHS.WORKSPACE} className="text-sm text-muted-foreground hover:text-primary transition-colors">Workspace</Link>
              </div>
              <div className="flex flex-col gap-3">
                <span className="font-semibold text-sm uppercase tracking-wider text-foreground">Legal</span>
                <span className="text-sm text-muted-foreground">Termos de Uso</span>
                <span className="text-sm text-muted-foreground">Privacidade</span>
                <span className="text-sm text-muted-foreground">Licença</span>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-border/20 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
            <p>© 2026 IDR Web Edition. Todos os direitos reservados.</p>
            <p>Desenvolvido para fins de pesquisa e educação em segurança cibernética.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
