import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { RevealDirective } from '../../../shared/ui/reveal.directive';
import { SectionHeaderComponent } from '../../../shared/ui/section-header.component';
import { FooterComponent } from '../footer/footer.component';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [NgOptimizedImage, FooterComponent, NavbarComponent, RevealDirective, SectionHeaderComponent],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss',
})
export class AboutUsComponent {
  readonly principles = [
    {
      icon: 'pi-bullseye',
      title: 'Nossa missão',
      text: 'Temos como missão promover a conservação da biodiversidade amazônica, integrando pesquisa científica, uso sustentável dos recursos naturais e valorização dos saberes tradicionais. Buscamos, por meio de ações e projetos, fortalecer práticas socioambientais que aliem proteção da natureza, geração de renda e educação ambiental, contribuindo para o desenvolvimento sustentável da região.',
    },
    {
      icon: 'pi-eye',
      title: 'Nossa visão',
      text: 'A instituição almeja ser reconhecida como agente transformador na Amazônia, contribuindo para a restauração dos ecossistemas, o fortalecimento das comunidades locais e a valorização da floresta em pé como caminho para o desenvolvimento sustentável.',
    },
    {
      icon: 'pi-heart',
      title: 'Valores',
      text: 'Nossos valores refletem o compromisso com a sustentabilidade e a ética, pautando todas as ações pela transparência e pelo respeito às pessoas e ao meio ambiente. A instituição acredita na valorização da ciência e na força da inovação, mas também reconhece a importância dos saberes tradicionais e da inclusão social como pilares fundamentais. Assim, reafirma sua dedicação à justiça socioambiental e à preservação da Amazônia para as presentes e futuras gerações.',
    },
  ];

  readonly areas = [
    {
      icon: 'pi-book',
      title: 'Educação Ambiental para Escolas e Comunidades',
      text: 'Desenvolvemos programas educativos voltados para escolas e comunidades, promovendo a conscientização ambiental e o conhecimento sobre a importância da conservação da Amazônia.',
    },
    {
      icon: 'pi-search',
      title: 'Monitoramento e Pesquisa da Biodiversidade',
      text: 'Realizamos estudos e monitoramento contínuo da biodiversidade amazônica, contribuindo para o conhecimento científico e a tomada de decisões baseadas em evidências.',
    },
    {
      icon: 'pi-briefcase',
      title: 'Consultorias Ambientais',
      text: 'Oferecemos serviços especializados de consultoria ambiental, auxiliando organizações e empresas na implementação de práticas sustentáveis e conformidade ambiental.',
    },
    {
      icon: 'pi-users',
      title: 'Projetos com Comunidades Tradicionais',
      text: 'Trabalhamos em parceria com comunidades tradicionais, valorizando seus saberes ancestrais e promovendo o desenvolvimento sustentável baseado na conservação.',
    },
    {
      icon: 'pi-refresh',
      title: 'Recuperação de Áreas Degradadas',
      text: 'Implementamos projetos de restauração ecológica em áreas degradadas, utilizando técnicas inovadoras e espécies nativas para recuperar ecossistemas amazônicos.',
    },
    {
      icon: 'pi-link',
      title: 'Apoio à Cadeia do Restauro',
      text: 'Fortalecemos a cadeia produtiva do restauro ecológico, conectando coletores de sementes, viveiros, projetos de reflorestamento e compradores de mudas nativas.',
    },
  ];

  readonly history = [
    'A Associação foi fundada em 2021, a partir das experiências acumuladas no CSNAM/UFAM, que revelaram a necessidade de uma maior articulação entre coletores, pesquisadores, projetos de reflorestamento e o mercado. A iniciativa foi idealizada e conduzida pelo professor Dr. Manuel de Jesus Vieira Lima Junior, docente da Universidade Federal do Amazonas (UFAM) e coordenador do CSNAM, com o propósito de criar um elo legal e institucional capaz de fortalecer toda a cadeia de restauração ecológica na região.',
    'O primeiro marco da trajetória da Associação foi a realização do Curso de Manejo e Coleta de Sementes no Dossel, que constituiu seu primeiro serviço e se tornou uma referência na formação de coletores qualificados. A partir dessa experiência pioneira, a instituição ampliou sua atuação, passando a desenvolver projetos de restauração e a oferecer serviços especializados, consolidando gradualmente sua presença e relevância no setor.',
  ];

  readonly team = [
    {
      position: 'Presidente',
      name: 'Israel Silva Junior',
      description: 'Engenheiro Florestal, com Mestrado em Ciências Florestais e Ambientais pela UFAM.',
      lattes: 'http://lattes.cnpq.br/8618253212004413',
    },
    {
      position: 'Tesoureiro',
      name: 'Rimer de Oliveira Maduro',
      description:
        'Engenheiro Florestal, Mestre em Ciências Florestais e Ambientais pela UFAM. Pós-graduado em Gestão de Projetos com expertise em comunidades indígenas e restauração ecológica.',
      lattes: 'http://lattes.cnpq.br/9696301120763498',
    },
    {
      position: 'Secretário',
      name: 'Paulo Vinícius da Silva Santos',
      description:
        'Engenheiro Florestal, Mestre em Ciências Florestais e Pós-Graduado em Georreferenciamento. 6 anos de experiência em Licenciamento Ambiental e Florestal.',
      lattes: 'http://lattes.cnpq.br/8437631035559919',
    },
    {
      position: 'Suplente',
      name: 'Valdejane da Silva Menezes',
      description: 'Tecnóloga em Alimentos, atua em projetos de segurança alimentar e fortalecimento das cadeias produtivas regionais.',
      lattes: 'http://lattes.cnpq.br/8282511867735434',
    },
    {
      position: 'Conselheiro Fiscal',
      name: 'Daniel Andrade Santiago',
      description:
        'Engenheiro Florestal pela UFAM e mestrando em Ciências Florestais e Ambientais. Experiência em agroecologia, SAFs e projetos comunitários na Amazônia.',
      lattes: 'http://lattes.cnpq.br/8078182786541483',
    },
    {
      position: 'Conselheiro Fiscal Suplente',
      name: 'Eudisvam Araujo Oliveira',
      description:
        'Engenheiro Florestal especialista em arboricultura, instrutor de coletores com expertise em implantação de ACS e coleta de sementes na Amazônia.',
      lattes: 'http://lattes.cnpq.br/2371976242137325',
    },
  ];
}
