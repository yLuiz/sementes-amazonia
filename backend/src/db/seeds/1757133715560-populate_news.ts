import { News } from 'src/entities/news.entity';
import { getCurrentTimeString } from 'src/utils/getCurrentTimeString';
import { parseDateToString } from 'src/utils/parseDateToString';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export class PopulateNews1757133715560 implements Seeder {
    track = false;

    public async run(
        dataSource: DataSource,
        factoryManager: SeederFactoryManager
    ): Promise<any> {
        const newsRepository = dataSource.getRepository(News);

        const newsToCreate: Partial<News>[] = [
            {
                title: 'Lançamento do Projeto Sementes da Amazônia',
                summary: 'Iniciamos o Projeto Sementes da Amazônia com o objetivo de promover a conservação ambiental e o desenvolvimento sustentável na região amazônica.',
                content: 'O Projeto Sementes da Amazônia visa plantar 100.000 árvores nativas em áreas degradadas da Amazônia até 2025. Convidamos todos a se juntarem a nós nessa missão vital para o planeta.',
                published_at: parseDateToString('2024-01-15 10:00:00'),
                author: 'João Wezen',
                tags: ['lançamento', 'conservação', 'sustentabilidade'].join(','),
                image_thumb: 'https://example.com/images/seed_project_launch.jpg',
            },
            {
                title: 'Parceria com Comunidades Locais',
                summary: 'Estamos colaborando com comunidades locais para garantir que nossas iniciativas sejam sustentáveis e beneficiem diretamente as pessoas que vivem na Amazônia.',
                content: 'Através de workshops e treinamentos, estamos capacitando moradores locais para participarem ativamente do reflorestamento e da conservação ambiental. Juntos, estamos fazendo a diferença.',
                published_at: parseDateToString('2024-03-22 14:30:00'),
                author: 'John Doe',
                tags: ['parceria', 'comunidades', 'sustentabilidade'].join(','),
                image_thumb: 'https://example.com/images/community_partnership.jpg',
            },
            {
                title: 'Resultados Iniciais do Projeto',
                summary: 'Após seis meses de atividades, já plantamos mais de 20.000 árvores nativas e restauramos várias áreas degradadas na Amazônia.',
                content: 'Os resultados iniciais do Projeto Sementes da Amazônia são promissores. Com o apoio de voluntários e parceiros, estamos no caminho certo para alcançar nossas metas de conservação e sustentabilidade.',
                published_at: parseDateToString('2024-06-10 09:15:00'),
                author: 'John Doe',
                tags: ['resultados', 'conservação', 'sustentabilidade'].join(','),
                image_thumb: 'https://example.com/images/initial_results.jpg',
            },
            {
                title: 'Evento de Plantio Comunitário',
                summary: 'Realizamos um evento de plantio comunitário que reuniu mais de 200 voluntários para plantar árvores nativas na Amazônia.',
                content: 'O evento foi um sucesso, com a participação ativa da comunidade local e voluntários de diversas regiões. Juntos, plantamos 5.000 árvores em um único dia!',
                published_at: parseDateToString('2024-08-05 11:00:00'),
                author: 'John Doe',
                tags: ['evento', 'plantio', 'comunidade'].join(','),
                image_thumb: 'https://example.com/images/community_planting_event.jpg',
            },
            {
                title: 'Iniciativa de Educação Ambiental',
                summary: 'Lançamos uma iniciativa de educação ambiental para conscientizar as comunidades locais sobre a importância da conservação da Amazônia.',
                content: 'Através de palestras, oficinas e materiais educativos, estamos promovendo a conscientização sobre práticas sustentáveis e a preservação dos recursos naturais da região.',
                published_at: parseDateToString('2024-09-10 10:00:00'),
                author: 'John Doe',
                tags: ['educação', 'ambiental', 'conservação'].join(','),
                image_thumb: 'https://example.com/images/environmental_education_initiative.jpg',
            },
            {
                title: 'Apoio Internacional ao Projeto',
                summary: 'Recebemos apoio internacional para expandir nossas atividades de conservação na Amazônia.',
                content: 'Organizações e indivíduos de todo o mundo estão se unindo ao Projeto Sementes da Amazônia, fornecendo recursos e expertise para fortalecer nossas iniciativas de reflorestamento e sustentabilidade.',
                published_at: parseDateToString('2024-10-15 12:00:00'),
                author: 'John Doe',
                tags: ['apoio', 'internacional', 'conservação'].join(','),
                image_thumb: 'https://example.com/images/international_support.jpg',
            },
            {
                title: 'Lançamento do Relatório Anual do Projeto',
                summary: 'Publicamos nosso primeiro relatório anual, destacando os progressos e impactos do Projeto Sementes da Amazônia.',
                content: 'O relatório detalha as atividades realizadas, os desafios enfrentados e os resultados alcançados até agora. Estamos comprometidos em manter a transparência e a responsabilidade em todas as nossas ações.',
                published_at: parseDateToString('2024-11-20 15:00:00'),
                author: 'John Doe',
                tags: ['relatório', 'anual', 'transparência'].join(','),
                image_thumb: 'https://example.com/images/annual_report_launch.jpg',
            },
            {
                title: 'Campanha de Arrecadação de Fundos',
                summary: 'Lançamos uma campanha de arrecadação de fundos para apoiar nossas atividades de conservação na Amazônia.',
                content: 'A campanha visa mobilizar recursos para expandir nossos esforços de reflorestamento e envolver mais comunidades locais em práticas sustentáveis. Cada contribuição faz a diferença!',
                published_at: parseDateToString('2024-12-05 09:00:00'),
                author: 'John Doe',
                tags: ['campanha', 'fundos', 'conservação'].join(','),
                image_thumb: 'https://example.com/images/fundraising_campaign.jpg',
            },
            {
                title: 'Parceria com Escolas Locais',
                summary: 'Estabelecemos parcerias com escolas locais para integrar a educação ambiental no currículo escolar.',
                content: 'As parcerias com escolas visam educar as futuras gerações sobre a importância da conservação da Amazônia, promovendo atividades práticas e projetos escolares relacionados ao meio ambiente.',
                published_at: parseDateToString('2025-01-10 10:30:00'),
                author: 'John Doe',
                tags: ['parceria', 'educação', 'ambiental'].join(','),
                image_thumb: 'https://example.com/images/school_partnerships.jpg',
            },
            {
                title: 'Iniciativa de Monitoramento da Biodiversidade',
                summary: 'Lançamos uma iniciativa de monitoramento da biodiversidade para avaliar o impacto das nossas atividades de reflorestamento.',
                content: 'Através do uso de tecnologias avançadas e parcerias com pesquisadores, estamos coletando dados sobre a fauna e flora locais para garantir que nossas ações estejam beneficiando a biodiversidade da região.',
                published_at: parseDateToString('2025-02-15 14:00:00'),
                author: 'John Doe',
                tags: ['monitoramento', 'biodiversidade', 'tecnologia'].join(','),
                image_thumb: 'https://example.com/images/biodiversity_monitoring.jpg',
            },
            {
                title: 'Evento de Conscientização Global',
                summary: 'Participamos de um evento global para destacar a importância da conservação da Amazônia e compartilhar nossas experiências.',
                content: 'O evento reuniu líderes, especialistas e ativistas de todo o mundo para discutir estratégias de conservação e sustentabilidade. Foi uma oportunidade valiosa para ampliar nossa rede de apoio e colaboração.',
                published_at: parseDateToString('2025-03-20 11:00:00'),
                author: 'John Doe',
                tags: ['evento', 'global', 'conscientização'].join(','),
                image_thumb: 'https://example.com/images/global_awareness_event.jpg',
            },
            {
                title: 'Lançamento do Programa de Voluntariado',
                summary: 'Iniciamos um programa de voluntariado para envolver mais pessoas nas atividades do Projeto Sementes da Amazônia.',
                content: 'O programa oferece oportunidades para voluntários participarem do plantio de árvores, educação ambiental e outras iniciativas, fortalecendo o impacto coletivo do nosso trabalho.',
                published_at: parseDateToString('2025-04-25 10:00:00'),
                author: 'John Doe',
                tags: ['voluntariado', 'engajamento', 'comunidade'].join(','),
                image_thumb: 'https://example.com/images/volunteer_program_launch.jpg',
            },
            {
                title: 'Parceria com Empresas Sustentáveis',
                summary: 'Estabelecemos parcerias com empresas comprometidas com a sustentabilidade para apoiar nossas iniciativas na Amazônia.',
                content: 'As parcerias com o setor privado visam alavancar recursos e expertise para ampliar o alcance e a eficácia do Projeto Sementes da Amazônia, promovendo práticas empresariais responsáveis.',
                published_at: parseDateToString('2025-05-30 13:00:00'),
                author: 'John Doe',
                tags: ['parceria', 'empresas', 'sustentabilidade'].join(','),
                image_thumb: 'https://example.com/images/sustainable_business_partnerships.jpg',
            },
            {
                title: 'Iniciativa de Recuperação de Solos Degradados',
                summary: 'Lançamos uma iniciativa focada na recuperação de solos degradados para melhorar a saúde dos ecossistemas locais.',
                content: 'Através de técnicas inovadoras, estamos restaurando a fertilidade do solo em áreas afetadas pela degradação, promovendo um ambiente mais saudável para o crescimento das árvores e a biodiversidade.',
                published_at: parseDateToString('2025-06-15 09:30:00'),
                author: 'John Doe',
                tags: ['recuperação', 'solos', 'ecossistemas'].join(','),
                image_thumb: 'https://example.com/images/soil_recovery_initiative.jpg',
            },
            {
                title: 'Evento de Celebração dos Primeiros 100.000 Árvores Plantadas',
                summary: 'Comemoramos a marca de 100.000 árvores plantadas na Amazônia com um evento especial.',
                content: 'O evento reuniu voluntários, parceiros e membros da comunidade para celebrar esse marco importante, refletindo sobre nossas conquistas e renovando nosso compromisso com a conservação ambiental.',
                published_at: parseDateToString('2025-07-20 16:00:00'),
                author: 'John Doe',
                tags: ['celebração', 'marco', 'conservação'].join(','),
                image_thumb: 'https://example.com/images/100k_trees_event.jpg',
            },
            {
                title: 'Lançamento do Aplicativo do Projeto Sementes da Amazônia',
                summary: 'Desenvolvemos um aplicativo para facilitar a participação e o engajamento com o Projeto Sementes da Amazônia.',
                content: 'O aplicativo oferece informações sobre nossas atividades, permite que voluntários se inscrevam em eventos e acompanhem o progresso do reflorestamento em tempo real.',
                published_at: parseDateToString('2025-08-25 10:00:00'),
                author: 'John Doe',
                tags: ['aplicativo', 'tecnologia', 'engajamento'].join(','),
                image_thumb: 'https://example.com/images/app_launch.jpg',
            },
            {
                title: 'Parceria com Organizações de Conservação',
                summary: 'Firmamos parcerias estratégicas com organizações de conservação para fortalecer nossas iniciativas na Amazônia.',
                content: 'As parcerias visam compartilhar recursos, conhecimento e experiências para maximizar o impacto das nossas ações de conservação e reflorestamento na região.',
                published_at: parseDateToString('2025-09-30 14:00:00'),
                author: 'John Doe',
                tags: ['parceria', 'conservação', 'colaboração'].join(','),
                image_thumb: 'https://example.com/images/conservation_partnerships.jpg',
            },
            {
                title: 'Iniciativa de Energia Renovável nas Comunidades Locais',
                summary: 'Lançamos uma iniciativa para promover o uso de energia renovável em comunidades locais da Amazônia.',
                content: 'A iniciativa visa reduzir a dependência de fontes de energia não sustentáveis, promovendo o uso de painéis solares e outras tecnologias limpas para melhorar a qualidade de vida das comunidades.',
                published_at: parseDateToString('2025-10-15 11:00:00'),
                author: 'John Doe',
                tags: ['energia', 'renovável', 'sustentabilidade'].join(','),
                image_thumb: 'https://example.com/images/renewable_energy_initiative.jpg',
            },
            {
                title: 'Evento de Encerramento do Ano do Projeto Sementes da Amazônia',
                summary: 'Realizamos um evento de encerramento do ano para refletir sobre nossas conquistas e planejar o futuro.',
                content: 'O evento contou com a participação de todos os envolvidos no projeto, celebrando os sucessos alcançados e discutindo estratégias para o próximo ano, com foco na expansão e fortalecimento das nossas iniciativas.',
                published_at: parseDateToString('2025-12-20 15:00:00'),
                author: 'John Doe',
                tags: ['evento', 'encerramento', 'planejamento'].join(','),
                image_thumb: 'https://example.com/images/year_end_event.jpg',
            },
        ];

        for (const newsData of newsToCreate) {
            const existingNews = await newsRepository.findOne({ where: { title: newsData.title } });
            if (!existingNews) {
                const news = newsRepository.create({
                    ...newsData,
                    created_at: getCurrentTimeString(),
                    updated_at: getCurrentTimeString()
                });
                await newsRepository.save(news);

                console.log(`✅ Notícia "${news.title}" criada com sucesso.`);

            } else {
                console.log(`ℹ️ Notícia "${newsData.title}" já existe. Pulando...`);
            }
        }

        console.log('🎉 Seed de notícias concluído!');

    }
}
