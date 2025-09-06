import { Project } from 'src/entities/project.entity';
import { getCurrentTimeString } from 'src/utils/getCurrentTimeString';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export class PopulateProjects1757133723324 implements Seeder {
    track = false;

    public async run(
        dataSource: DataSource,
        factoryManager: SeederFactoryManager
    ): Promise<any> {
        const projectRepository = dataSource.getRepository(Project);

        const projectsToCreate: Partial<Project>[] = [
            {
                title: 'Projeto Sementes da Amazônia',
                summary: 'Iniciativa para preservar a biodiversidade da Amazônia através do plantio de árvores nativas.',
                content: 'O Projeto Sementes da Amazônia visa coletar, armazenar e plantar sementes de árvores nativas da região amazônica, promovendo a recuperação de áreas degradadas e a conservação da biodiversidade local. Através de parcerias com comunidades locais e organizações ambientais, buscamos criar um impacto positivo e sustentável na floresta.',
                image_thumb: 'https://example.com/images/projeto-sementes-amazonia.jpg',
            },
            {
                title: 'Reflorestamento Comunitário',
                summary: 'Empoderando comunidades locais para restaurar áreas desmatadas na Amazônia.',
                content: 'O projeto de Reflorestamento Comunitário trabalha diretamente com comunidades indígenas e ribeirinhas para capacitar os moradores locais na coleta e plantio de sementes, bem como no manejo sustentável das florestas. A iniciativa não só ajuda a restaurar áreas desmatadas, mas também promove a geração de renda através do ecoturismo e da venda de produtos florestais não madeireiros.',
                image_thumb: 'https://example.com/images/reflorestamento-comunitario.jpg',
            },
            {
                title: 'Educação Ambiental na Amazônia',
                summary: 'Programa educacional para conscientizar sobre a importância da conservação ambiental.',
                content: 'Nosso programa de Educação Ambiental na Amazônia tem como objetivo sensibilizar crianças, jovens e adultos sobre a importância da conservação dos ecossistemas amazônicos. Através de oficinas, palestras e atividades práticas, incentivamos a participação ativa das comunidades na proteção do meio ambiente, promovendo valores de sustentabilidade e respeito à natureza.',
                image_thumb: 'https://example.com/images/educacao-ambiental.jpg',
            },
            {
                title: 'Monitoramento da Fauna Amazônica',
                summary: 'Projeto para monitorar e proteger a fauna nativa da Amazônia.',
                content: 'O Monitoramento da Fauna Amazônica utiliza tecnologias como armadilhas fotográficas e drones para acompanhar a biodiversidade animal na região. O projeto visa identificar espécies ameaçadas, entender seus hábitos e promover ações de conservação eficazes, envolvendo pesquisadores e comunidades locais no processo.',
                image_thumb: 'https://example.com/images/monitoramento-fauna.jpg',
            },
            {
                title: 'Turismo Sustentável na Amazônia',
                summary: 'Desenvolvimento de práticas de turismo que respeitam o meio ambiente e as comunidades locais.',
                content: 'O projeto de Turismo Sustentável na Amazônia busca criar oportunidades econômicas para as comunidades locais através do turismo ecológico. Promovemos práticas que minimizam o impacto ambiental, valorizam a cultura local e incentivam a conservação dos recursos naturais, oferecendo experiências autênticas aos visitantes.',
                image_thumb: 'https://example.com/images/turismo-sustentavel.jpg',
            },
            {
                title: 'Pesquisa Científica na Amazônia',
                summary: 'Apoio a pesquisas que visam entender e conservar os ecossistemas amazônicos.',
                content: 'Nosso projeto de Pesquisa Científica na Amazônia colabora com universidades e institutos de pesquisa para estudar a biodiversidade, os ciclos hidrológicos e os impactos das mudanças climáticas na região. Os dados coletados são essenciais para informar políticas públicas e estratégias de conservação eficazes.',
                image_thumb: 'https://example.com/images/pesquisa-cientifica.jpg',
            },
            {
                title: 'Capacitação em Técnicas de Plantio',
                summary: 'Treinamento para comunidades locais em técnicas de plantio e manejo florestal.',
                content: 'O projeto de Capacitação em Técnicas de Plantio oferece workshops e treinamentos práticos para membros das comunidades locais, ensinando métodos eficazes de coleta, armazenamento e plantio de sementes, bem como técnicas de manejo florestal sustentável. O objetivo é fortalecer a capacidade local para a conservação e recuperação das florestas.',
                image_thumb: 'https://example.com/images/capacitacao-plantio.jpg',
            },
            {
                title: 'Conservação de Áreas Protegidas',
                summary: 'Iniciativa para proteger e conservar áreas de alta biodiversidade na Amazônia.',
                content: 'Nosso projeto de Conservação de Áreas Protegidas trabalha em parceria com órgãos governamentais e ONGs para identificar, proteger e monitorar áreas de alta biodiversidade na Amazônia. Através de ações de fiscalização, educação ambiental e envolvimento comunitário, buscamos garantir a preservação desses ecossistemas vitais.',
                image_thumb: 'https://example.com/images/conservacao-areas-protegidas.jpg',
            },
            {
                title: 'Recuperação de Matas Ciliares',
                summary: 'Projeto focado na restauração de matas ciliares ao longo dos rios amazônicos.',
                content: 'A Recuperação de Matas Ciliares é essencial para proteger os recursos hídricos e a biodiversidade aquática na Amazônia. Nosso projeto envolve o plantio de espécies nativas ao longo das margens dos rios, trabalhando com comunidades locais para garantir a sustentabilidade dessas áreas e promover a saúde dos ecossistemas aquáticos.',
                image_thumb: 'https://example.com/images/recuperacao-matas-ciliares.jpg',
            },
            {
                title: 'Evento de Encerramento do Ano',
                summary: 'Refletindo sobre nossas conquistas e planejando o futuro.',
                content: 'O evento contou com a participação de todos os envolvidos no projeto, celebrando os sucessos alcançados e discutindo estratégias para o próximo ano, com foco na expansão e fortalecimento das nossas iniciativas.',
                image_thumb: 'https://example.com/images/year_end_event.jpg',
            },
            {
                title: 'Projeto de Conservação de Borboletas',
                summary: 'Iniciativa para proteger espécies de borboletas ameaçadas na Amazônia.',
                content: 'O Projeto de Conservação de Borboletas visa identificar e proteger espécies de borboletas que estão em risco devido à perda de habitat e mudanças climáticas. Através do monitoramento, pesquisa e educação ambiental, buscamos aumentar a conscientização sobre a importância dessas espécies para o ecossistema.',
                image_thumb: 'https://example.com/images/conservacao-borboletas.jpg',
            },
            {
                title: 'Programa de Sementes Urbanas',
                summary: 'Incentivando o plantio de árvores nativas em áreas urbanas da Amazônia.',
                content: 'O Programa de Sementes Urbanas promove o plantio de árvores nativas em parques, escolas e áreas públicas nas cidades amazônicas. A iniciativa visa melhorar a qualidade do ar, aumentar a biodiversidade urbana e envolver a comunidade na conservação ambiental.',
                image_thumb: 'https://example.com/images/sementes-urbanas.jpg',
            },
            {
                title: 'Projeto de Apicultura Sustentável',
                summary: 'Desenvolvimento de práticas de apicultura que beneficiam tanto as abelhas quanto as comunidades locais.',
                content: 'O Projeto de Apicultura Sustentável trabalha com comunidades locais para desenvolver técnicas de apicultura que promovem a saúde das colmeias e a produção de mel, ao mesmo tempo em que conservam o habitat natural das abelhas. A iniciativa também inclui educação sobre a importância das abelhas para a polinização e a biodiversidade.',
                image_thumb: 'https://example.com/images/apicultura-sustentavel.jpg',
            },
            {
                title: 'Iniciativa de Energia Renovável',
                summary: 'Promovendo o uso de fontes de energia renovável em comunidades amazônicas.',
                content: 'A Iniciativa de Energia Renovável busca implementar soluções de energia limpa, como painéis solares e turbinas eólicas, em comunidades remotas da Amazônia. O objetivo é reduzir a dependência de combustíveis fósseis, diminuir o impacto ambiental e melhorar a qualidade de vida dos moradores locais.',
                image_thumb: 'https://example.com/images/energia-renovavel.jpg',
            },
            {
                title: 'Projeto de Turismo Comunitário',
                summary: 'Desenvolvendo o turismo sustentável liderado por comunidades locais na Amazônia.',
                content: 'O Projeto de Turismo Comunitário capacita comunidades indígenas e ribeirinhas para oferecer experiências turísticas autênticas e sustentáveis. A iniciativa promove a valorização da cultura local, a conservação ambiental e a geração de renda para as comunidades envolvidas.',
                image_thumb: 'https://example.com/images/turismo-comunitario.jpg',
            }
        ];

        for (const projectData of projectsToCreate) {
            const existingProject = await projectRepository.findOne({ where: { title: projectData.title } });
            if (!existingProject) {
                const project = projectRepository.create({
                    ...projectData,
                    created_at: getCurrentTimeString(),
                    updated_at: getCurrentTimeString()
                });
                await projectRepository.save(project);

                console.log(`✅ Projeto "${project.title}" criado com sucesso.`);
            }
            else {
                console.log(`ℹ️ Projeto "${projectData.title}" já existe. Pulando...`);
            }
        }


        console.log('🎉 Seed de projetos concluído!');

    }
}
