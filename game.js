// ==========================================
// EFEITO GLOBAL DE HOVER E CLIQUE NOS BOTÕES
// ==========================================
function aplicarEfeitoBotao(cena, botao, acaoClique) {
    const escalaBaseX = botao.scaleX;
    const escalaBaseY = botao.scaleY;

    botao.on('pointerover', () => {
        botao.setTint(0xf4f4f4);
        cena.tweens.killTweensOf(botao);
        cena.tweens.add({
            targets: botao,
            scaleX: escalaBaseX * 1.07,
            scaleY: escalaBaseY * 1.07,
            duration: 140,
            ease: 'Back.easeOut'
        });
    });

    botao.on('pointerout', () => {
        botao.clearTint();
        cena.tweens.killTweensOf(botao);
        cena.tweens.add({
            targets: botao,
            scaleX: escalaBaseX,
            scaleY: escalaBaseY,
            duration: 140,
            ease: 'Power2'
        });
    });

    botao.on('pointerdown', () => {
        botao.setTint(0xcccccc);
        cena.tweens.killTweensOf(botao);
        cena.tweens.add({
            targets: botao,
            scaleX: escalaBaseX * 0.93,
            scaleY: escalaBaseY * 0.93,
            duration: 70,
            ease: 'Power2'
        });
    });

    botao.on('pointerup', () => {
        botao.clearTint();
        cena.tweens.killTweensOf(botao);
        cena.tweens.add({
            targets: botao,
            scaleX: escalaBaseX * 1.04,
            scaleY: escalaBaseY * 1.04,
            duration: 90,
            ease: 'Back.easeOut',
            onComplete: () => {
                botao.setScale(escalaBaseX, escalaBaseY);
                if (acaoClique) acaoClique();
            }
        });
    });

    return botao;
}


// ==========================================
// TELA INICIAL - MENU PRINCIPAL
// ==========================================
class MenuInicial extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuInicial' });
    }

    preload() {
        this.load.image('telaMenuInicial', 'assets/tela_menuinicial.png');
        this.load.image('btnComecarMenu', 'assets/botao_comecarmenu.png');
        this.load.image('btnTutorial', 'assets/botao_tutorial.png');
        this.load.image('btnApoio', 'assets/botao_apoio.png');
        this.load.image('btnCreditos', 'assets/botao_creditos.png');
        this.load.image('btnSairMenu', 'assets/botao_sairmenu.png');
    }

    create() {
        this.add.image(800, 450, 'telaMenuInicial').setDisplaySize(1600, 900);

        const posX = 1296;
        const larguraBotao = 400;

        // 1. Botão COMEÇAR -> Vai para a tela inicial da Fase 1
        this.criarBotaoMenu(posX, 135, 'btnComecarMenu', larguraBotao, () => {
            this.scene.start('TelaInicialFase1');
        });

        // 2. Botão TUTORIAL -> Vai para a tela de Tutorial
        this.criarBotaoMenu(posX, 292, 'btnTutorial', larguraBotao, () => {
            this.scene.start('Tutorial');
        });

        // 3. Botão APOIO PEDAGÓGICO -> Vai para a tela de Apoio Pedagógico
        this.criarBotaoMenu(posX, 450, 'btnApoio', larguraBotao, () => {
            this.scene.start('ApoioPedagogico');
        });

        // 4. Botão CRÉDITOS -> Vai para a tela de Créditos
        if (this.textures.exists('btnCreditos') && this.textures.get('btnCreditos').key !== '__MISSING') {
            this.criarBotaoMenu(posX, 608, 'btnCreditos', larguraBotao, () => {
                this.scene.start('Creditos', { origem: 'MenuInicial' });
            });
        } else {
            let zonaCreditos = this.add.zone(posX, 608, larguraBotao, 105)
                .setInteractive({ useHandCursor: true });
            zonaCreditos.on('pointerup', () => {
                this.scene.start('Creditos', { origem: 'MenuInicial' });
            });
        }

        // 5. Botão SAIR -> Fecha/encerra o jogo
        this.criarBotaoMenu(posX, 765, 'btnSairMenu', larguraBotao, () => {
            sairJogo();
        });
    }

    criarBotaoMenu(x, y, chaveImagem, largura, acaoClique) {
        let botao = this.add.image(x, y, chaveImagem)
            .setInteractive({ useHandCursor: true });

        botao.displayWidth = largura;
        botao.scaleY = botao.scaleX;

        return aplicarEfeitoBotao(this, botao, acaoClique);
    }
}


// ==========================================
// TELA INICIAL DA FASE 1 (APÓS CLICAR EM COMEÇAR)
// ==========================================
class TelaInicialFase1 extends Phaser.Scene {
    constructor() {
        super({ key: 'TelaInicialFase1' });
    }

    preload() {
        this.load.image('telaInicialFase1', 'assets/tela_inicialfase1.png');
        this.load.on('loaderror', (file) => {
            if (file.key === 'telaInicialFase1' && file.src.endsWith('.png')) {
                this.load.image('telaInicialFase1', 'assets/tela_inicialfase1.jpg');
            }
        });

        this.load.image('btnContinuar', 'assets/botao_continuar.png');
        this.load.image('btnTelaInicial', 'assets/botao_telainicial.png');
    }

    create() {
        this.add.image(800, 450, 'telaInicialFase1').setDisplaySize(1600, 900);

        // Botão CONTINUAR (dentro do painel roxo -> inicia a Fase 1)
        let btnContinuar = this.add.image(1000, 637, 'btnContinuar')
            .setInteractive({ useHandCursor: true });
        btnContinuar.displayWidth = 356;
        btnContinuar.scaleY = btnContinuar.scaleX;

        aplicarEfeitoBotao(this, btnContinuar, () => {
            this.scene.start('Fase1', { tempoSegundos: 0 });
        });

        // Botão TELA INICIAL (canto inferior esquerdo -> volta para o Menu Inicial)
        let btnTelaInicial = this.add.image(214, 818, 'btnTelaInicial')
            .setInteractive({ useHandCursor: true });
        btnTelaInicial.displayWidth = 265;
        btnTelaInicial.scaleY = btnTelaInicial.scaleX;

        aplicarEfeitoBotao(this, btnTelaInicial, () => {
            this.scene.start('MenuInicial');
        });
    }
}


// ==========================================
// TUTORIAL - NAVEGAÇÃO ENTRE AS 9 TELAS
// ==========================================
class Tutorial extends Phaser.Scene {
    constructor() {
        super({ key: 'Tutorial' });
    }

    preload() {
        this.totalTelas = 9;

        for (let i = 1; i <= this.totalTelas; i++) {
            this.load.image(`telaTutorial${i}`, `assets/tela_tutorial${i}.png`);
        }

        this.load.image('btnTelaInicial', 'assets/botao_telainicial.png');
        this.load.image('btnAnterior', 'assets/botal_anterior.png');
        this.load.image('btnProximo', 'assets/botao_proximo.png');
    }

    create() {
        this.indiceAtual = 0;

        this.imagemTutorial = this.add.image(800, 450, 'telaTutorial1').setDisplaySize(1600, 900);

        this.btnTelaInicial = this.criarBotaoTutorial('btnTelaInicial', () => {
            this.scene.start('MenuInicial');
        });

        this.btnAnterior = this.criarBotaoTutorial('btnAnterior', () => {
            if (this.indiceAtual > 0) {
                this.indiceAtual--;
                this.atualizarTela();
            }
        });

        this.btnProximo = this.criarBotaoTutorial('btnProximo', () => {
            if (this.indiceAtual < this.totalTelas - 1) {
                this.indiceAtual++;
                this.atualizarTela();
            }
        });

        this.input.keyboard.on('keydown-RIGHT', () => {
            if (this.indiceAtual < this.totalTelas - 1) {
                this.indiceAtual++;
                this.atualizarTela();
            }
        });

        this.input.keyboard.on('keydown-LEFT', () => {
            if (this.indiceAtual > 0) {
                this.indiceAtual--;
                this.atualizarTela();
            }
        });

        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.start('MenuInicial');
        });

        this.atualizarTela();
    }

    criarBotaoTutorial(chaveImagem, acaoClique) {
        let botao = this.add.image(0, 818, chaveImagem)
            .setInteractive({ useHandCursor: true })
            .setDepth(10);

        botao.displayWidth = 285;
        botao.scaleY = botao.scaleX;

        return aplicarEfeitoBotao(this, botao, acaoClique);
    }

    atualizarTela() {
        const numeroTela = this.indiceAtual + 1;
        this.imagemTutorial.setTexture(`telaTutorial${numeroTela}`).setDisplaySize(1600, 900);

        const posY = 818;

        if (this.indiceAtual === 0) {
            this.btnTelaInicial.setVisible(true).setPosition(605, posY);
            this.btnProximo.setVisible(true).setPosition(955, posY);
            this.btnAnterior.setVisible(false);
        } else if (this.indiceAtual === this.totalTelas - 1) {
            this.btnTelaInicial.setVisible(true).setPosition(605, posY);
            this.btnAnterior.setVisible(true).setPosition(955, posY);
            this.btnProximo.setVisible(false);
        } else {
            this.btnTelaInicial.setVisible(true).setPosition(362, posY);
            this.btnAnterior.setVisible(true).setPosition(796, posY);
            this.btnProximo.setVisible(true).setPosition(1228, posY);
        }
    }
}

// ==========================================
// APOIO PEDAGÓGICO
// ==========================================
class ApoioPedagogico extends Phaser.Scene {
    constructor() {
        super({ key: 'ApoioPedagogico' });
    }

    preload() {
        this.load.image('telaApoioPedagogico', 'assets/tela_apoiopedagogico.png');
        this.load.on('loaderror', (file) => {
            if (file.key === 'telaApoioPedagogico' && file.src.endsWith('.png')) {
                this.load.image('telaApoioPedagogico', 'assets/tela_apoiopedagogico.jpg');
            }
        });

        this.load.image('btnResumoPleno', 'assets/botao_resumopleno.png');
        this.load.image('btnMaterialProfessor', 'assets/botao_materialprofessor.png');
        this.load.image('btnMaterialEstudante', 'assets/botao_materialestudante.png');
        this.load.image('btnSobreProjeto', 'assets/botao_sobreoprojeto.png');
        this.load.image('btnSairMenu', 'assets/botao_sairmenu.png');
    }

    create() {
        this.add.image(800, 450, 'telaApoioPedagogico').setDisplaySize(1600, 900);

        const posXDireita = 1296;
        const larguraDireita = 400;

        // 1. Botão RESUMO PLENO
        this.criarBotaoApoio(posXDireita, 232, 'btnResumoPleno', larguraDireita, () => {
            this.scene.start('ResumoPleno');
        });

        // 2. Botão MATERIAL PROFESSOR
        this.criarBotaoApoio(posXDireita, 396, 'btnMaterialProfessor', larguraDireita, () => {
            this.scene.start('MaterialProfessor');
        });

        // 3. Botão MATERIAL ESTUDANTE
        this.criarBotaoApoio(posXDireita, 560, 'btnMaterialEstudante', larguraDireita, () => {
            this.scene.start('MaterialEstudante');
        });

        // 4. Botão SAIR
        this.criarBotaoApoio(posXDireita, 724, 'btnSairMenu', larguraDireita, () => {
            this.scene.start('MenuInicial');
        });

        // 5. Botão SOBRE O PROJETO
        this.criarBotaoApoio(540, 566, 'btnSobreProjeto', 508, () => {
            this.scene.start('SobreOProjeto');
        });

        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.start('MenuInicial');
        });
    }

    criarBotaoApoio(x, y, chaveImagem, largura, acaoClique) {
        let botao = this.add.image(x, y, chaveImagem)
            .setInteractive({ useHandCursor: true });

        botao.displayWidth = largura;
        botao.scaleY = botao.scaleX;

        return aplicarEfeitoBotao(this, botao, acaoClique);
    }
}


// ==========================================
// SOBRE O PROJETO - NAVEGAÇÃO ENTRE AS 3 TELAS
// ==========================================
class SobreOProjeto extends Phaser.Scene {
    constructor() {
        super({ key: 'SobreOProjeto' });
    }

    preload() {
        this.totalTelas = 3;

        for (let i = 1; i <= this.totalTelas; i++) {
            this.load.image(`telaSobre${i}`, `assets/tela_sobre${i}.png`);
        }

        this.load.on('loaderror', (file) => {
            if (file.key.startsWith('telaSobre') && file.src.endsWith('.png')) {
                const num = file.key.replace('telaSobre', '');
                this.load.image(file.key, `assets/tela_sobre${num}.jpg`);
            }
        });

        this.load.image('btnTelaInicial', 'assets/botao_telainicial.png');
        this.load.image('btnAnterior', 'assets/botal_anterior.png');
        this.load.image('btnProximo', 'assets/botao_proximo.png');
    }

    create() {
        this.indiceAtual = 0;

        this.imagemSobre = this.add.image(800, 450, 'telaSobre1').setDisplaySize(1600, 900);

        this.btnTelaInicial = this.criarBotaoSobre('btnTelaInicial', () => {
            this.scene.start('ApoioPedagogico');
        });

        this.btnAnterior = this.criarBotaoSobre('btnAnterior', () => {
            if (this.indiceAtual > 0) {
                this.indiceAtual--;
                this.atualizarTela();
            }
        });

        this.btnProximo = this.criarBotaoSobre('btnProximo', () => {
            if (this.indiceAtual < this.totalTelas - 1) {
                this.indiceAtual++;
                this.atualizarTela();
            }
        });

        this.input.keyboard.on('keydown-RIGHT', () => {
            if (this.indiceAtual < this.totalTelas - 1) {
                this.indiceAtual++;
                this.atualizarTela();
            }
        });

        this.input.keyboard.on('keydown-LEFT', () => {
            if (this.indiceAtual > 0) {
                this.indiceAtual--;
                this.atualizarTela();
            }
        });

        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.start('ApoioPedagogico');
        });

        this.atualizarTela();
    }

    criarBotaoSobre(chaveImagem, acaoClique) {
        let botao = this.add.image(0, 825, chaveImagem)
            .setInteractive({ useHandCursor: true })
            .setDepth(10);

        botao.displayWidth = 265;
        botao.scaleY = botao.scaleX;

        return aplicarEfeitoBotao(this, botao, acaoClique);
    }

    atualizarTela() {
        const numeroTela = this.indiceAtual + 1;
        this.imagemSobre.setTexture(`telaSobre${numeroTela}`).setDisplaySize(1600, 900);

        const posY = 825;

        if (this.indiceAtual === 0) {
            this.btnTelaInicial.setVisible(true).setPosition(612, posY);
            this.btnProximo.setVisible(true).setInteractive({ useHandCursor: true }).setPosition(966, posY);
            this.btnAnterior.setVisible(false).disableInteractive();
        } else if (this.indiceAtual === this.totalTelas - 1) {
            this.btnTelaInicial.setVisible(true).setPosition(612, posY);
            this.btnAnterior.setVisible(true).setInteractive({ useHandCursor: true }).setPosition(966, posY);
            this.btnProximo.setVisible(false).disableInteractive();
        } else {
            this.btnTelaInicial.setVisible(true).setPosition(385, posY);
            this.btnAnterior.setVisible(true).setInteractive({ useHandCursor: true }).setPosition(795, posY);
            this.btnProximo.setVisible(true).setInteractive({ useHandCursor: true }).setPosition(1205, posY);
        }
    }
}


// ==========================================
// RESUMO PLENO - NAVEGAÇÃO ENTRE AS 11 TELAS
// ==========================================
class ResumoPleno extends Phaser.Scene {
    constructor() {
        super({ key: 'ResumoPleno' });
    }

    preload() {
        this.totalTelas = 11;

        for (let i = 1; i <= this.totalTelas; i++) {
            this.load.image(`telaResumo${i}`, `assets/tela_resumo${i}.png`);
        }

        this.load.on('loaderror', (file) => {
            if (file.key.startsWith('telaResumo') && file.src.endsWith('.png')) {
                const num = file.key.replace('telaResumo', '');
                this.load.image(file.key, `assets/tela_resumo${num}.jpg`);
            }
        });

        this.load.image('btnTelaInicial', 'assets/botao_telainicial.png');
        this.load.image('btnAnterior', 'assets/botal_anterior.png');
        this.load.image('btnProximo', 'assets/botao_proximo.png');
    }

    create() {
        this.indiceAtual = 0;

        this.imagemResumo = this.add.image(800, 450, 'telaResumo1').setDisplaySize(1600, 900);

        this.btnTelaInicial = this.criarBotaoResumo('btnTelaInicial', () => {
            this.scene.start('ApoioPedagogico');
        });

        this.btnAnterior = this.criarBotaoResumo('btnAnterior', () => {
            if (this.indiceAtual > 0) {
                this.indiceAtual--;
                this.atualizarTela();
            }
        });

        this.btnProximo = this.criarBotaoResumo('btnProximo', () => {
            if (this.indiceAtual < this.totalTelas - 1) {
                this.indiceAtual++;
                this.atualizarTela();
            }
        });

        this.input.keyboard.on('keydown-RIGHT', () => {
            if (this.indiceAtual < this.totalTelas - 1) {
                this.indiceAtual++;
                this.atualizarTela();
            }
        });

        this.input.keyboard.on('keydown-LEFT', () => {
            if (this.indiceAtual > 0) {
                this.indiceAtual--;
                this.atualizarTela();
            }
        });

        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.start('ApoioPedagogico');
        });

        this.atualizarTela();
    }

    criarBotaoResumo(chaveImagem, acaoClique) {
        let botao = this.add.image(0, 825, chaveImagem)
            .setInteractive({ useHandCursor: true })
            .setDepth(10);

        botao.displayWidth = 265;
        botao.scaleY = botao.scaleX;

        return aplicarEfeitoBotao(this, botao, acaoClique);
    }

    atualizarTela() {
        const numeroTela = this.indiceAtual + 1;
        this.imagemResumo.setTexture(`telaResumo${numeroTela}`).setDisplaySize(1600, 900);

        const posY = 825;

        if (this.indiceAtual === 0) {
            this.btnTelaInicial.setVisible(true).setPosition(612, posY);
            this.btnProximo.setVisible(true).setInteractive({ useHandCursor: true }).setPosition(966, posY);
            this.btnAnterior.setVisible(false).disableInteractive();
        } else if (this.indiceAtual === this.totalTelas - 1) {
            this.btnTelaInicial.setVisible(true).setPosition(612, posY);
            this.btnAnterior.setVisible(true).setInteractive({ useHandCursor: true }).setPosition(966, posY);
            this.btnProximo.setVisible(false).disableInteractive();
        } else {
            this.btnTelaInicial.setVisible(true).setPosition(385, posY);
            this.btnAnterior.setVisible(true).setInteractive({ useHandCursor: true }).setPosition(795, posY);
            this.btnProximo.setVisible(true).setInteractive({ useHandCursor: true }).setPosition(1205, posY);
        }
    }
}


// ==========================================
// MATERIAL DO PROFESSOR - NAVEGAÇÃO ENTRE AS 10 TELAS
// ==========================================
class MaterialProfessor extends Phaser.Scene {
    constructor() {
        super({ key: 'MaterialProfessor' });
    }

    preload() {
        this.ordemTelas = [1, 10, 9, 8, 7, 6, 5, 4, 3, 2];
        this.totalTelas = this.ordemTelas.length;

        for (let i = 1; i <= this.totalTelas; i++) {
            this.load.image(`telaMaterialProfessor${i}`, `assets/tela_materialprofessor${i}.png`);
        }

        this.load.on('loaderror', (file) => {
            if (file.key.startsWith('telaMaterialProfessor') && file.src.endsWith('.png')) {
                const num = file.key.replace('telaMaterialProfessor', '');
                this.load.image(file.key, `assets/tela_materialprofessor${num}.jpg`);
            }
        });

        this.load.image('btnTelaInicial', 'assets/botao_telainicial.png');
        this.load.image('btnAnterior', 'assets/botal_anterior.png');
        this.load.image('btnProximo', 'assets/botao_proximo.png');
    }

    create() {
        this.indiceAtual = 0;

        this.imagemMaterialProfessor = this.add.image(800, 450, `telaMaterialProfessor${this.ordemTelas[0]}`).setDisplaySize(1600, 900);

        this.btnTelaInicial = this.criarBotaoMaterialProfessor('btnTelaInicial', () => {
            this.scene.start('ApoioPedagogico');
        });

        this.btnAnterior = this.criarBotaoMaterialProfessor('btnAnterior', () => {
            if (this.indiceAtual > 0) {
                this.indiceAtual--;
                this.atualizarTela();
            }
        });

        this.btnProximo = this.criarBotaoMaterialProfessor('btnProximo', () => {
            if (this.indiceAtual < this.totalTelas - 1) {
                this.indiceAtual++;
                this.atualizarTela();
            }
        });

        this.input.keyboard.on('keydown-RIGHT', () => {
            if (this.indiceAtual < this.totalTelas - 1) {
                this.indiceAtual++;
                this.atualizarTela();
            }
        });

        this.input.keyboard.on('keydown-LEFT', () => {
            if (this.indiceAtual > 0) {
                this.indiceAtual--;
                this.atualizarTela();
            }
        });

        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.start('ApoioPedagogico');
        });

        this.atualizarTela();
    }

    criarBotaoMaterialProfessor(chaveImagem, acaoClique) {
        let botao = this.add.image(0, 825, chaveImagem)
            .setInteractive({ useHandCursor: true })
            .setDepth(10);

        botao.displayWidth = 265;
        botao.scaleY = botao.scaleX;

        return aplicarEfeitoBotao(this, botao, acaoClique);
    }

    atualizarTela() {
        const numeroArquivo = this.ordemTelas[this.indiceAtual];
        this.imagemMaterialProfessor.setTexture(`telaMaterialProfessor${numeroArquivo}`).setDisplaySize(1600, 900);

        const posY = 825;

        if (this.indiceAtual === 0) {
            this.btnTelaInicial.setVisible(true).setPosition(612, posY);
            this.btnProximo.setVisible(true).setInteractive({ useHandCursor: true }).setPosition(966, posY);
            this.btnAnterior.setVisible(false).disableInteractive();
        } else if (this.indiceAtual === this.totalTelas - 1) {
            this.btnTelaInicial.setVisible(true).setPosition(612, posY);
            this.btnAnterior.setVisible(true).setInteractive({ useHandCursor: true }).setPosition(966, posY);
            this.btnProximo.setVisible(false).disableInteractive();
        } else {
            this.btnTelaInicial.setVisible(true).setPosition(385, posY);
            this.btnAnterior.setVisible(true).setInteractive({ useHandCursor: true }).setPosition(795, posY);
            this.btnProximo.setVisible(true).setInteractive({ useHandCursor: true }).setPosition(1205, posY);
        }
    }
}


// ==========================================
// MATERIAL DO ESTUDANTE - 2 TELAS + BOTÕES INTERNOS
// ==========================================
class MaterialEstudante extends Phaser.Scene {
    constructor() {
        super({ key: 'MaterialEstudante' });
    }

    preload() {
        this.totalTelas = 2;

        for (let i = 1; i <= this.totalTelas; i++) {
            this.load.image(`telaMaterialEstudantes${i}`, `assets/tela_materialestudantes${i}.png`);
        }

        // Botões centrais da 1ª tela (COMPONENTES E FUNÇÕES e REVISÃO)
        this.load.image('btnComponentesRevisao', 'assets/botao_componentesrevisão.png');
        this.load.image('btnRevisao', 'assets/botao_revisao.png');

        // Botões inferiores de navegação
        this.load.image('btnTelaInicial', 'assets/botao_telainicial.png');
        this.load.image('btnAnterior', 'assets/botal_anterior.png');
        this.load.image('btnProximo', 'assets/botao_proximo.png');

        // Fallback automático caso algum arquivo esteja em .jpg
        this.load.on('loaderror', (file) => {
            if (file.key.startsWith('telaMaterialEstudantes') && file.src.endsWith('.png')) {
                const num = file.key.replace('telaMaterialEstudantes', '');
                this.load.image(file.key, `assets/tela_materialestudantes${num}.jpg`);
            }
            if (file.key === 'btnComponentesRevisao') {
                if (file.src.endsWith('revis%C3%A3o.png') || file.src.endsWith('revisão.png')) {
                    this.load.image('btnComponentesRevisao', 'assets/botao_componentesrevisão.jpg');
                } else if (file.src.endsWith('revis%C3%A3o.jpg') || file.src.endsWith('revisão.jpg')) {
                    this.load.image('btnComponentesRevisao', 'assets/botao_componentesrevisao.png');
                }
            }
            if (file.key === 'btnRevisao' && file.src.endsWith('.png')) {
                this.load.image('btnRevisao', 'assets/botao_revisao.jpg');
            }
        });
    }

    create() {
        this.indiceAtual = 0;

        this.imagemEstudante = this.add.image(800, 450, 'telaMaterialEstudantes1').setDisplaySize(1600, 900);

        // Botão COMPONENTES E FUNÇÕES (dentro do painel azul, à esquerda)
        this.btnComponentesRevisao = this.criarBotaoEstudante(618, 675, 'btnComponentesRevisao', 325, () => {
            this.scene.start('ComponentesFuncoes');
        });

        // Botão REVISÃO (dentro do painel azul, à direita)
        this.btnRevisao = this.criarBotaoEstudante(982, 675, 'btnRevisao', 325, () => {
            this.scene.start('Revisao');
        });

        // Botão TELA INICIAL (canto inferior esquerdo -> volta para Apoio Pedagógico)
        this.btnTelaInicial = this.criarBotaoEstudante(180, 828, 'btnTelaInicial', 280, () => {
            this.scene.start('ApoioPedagogico');
        });

        // Botão ANTERIOR (canto inferior direito na 2ª tela -> volta para a 1ª tela)
        this.btnAnterior = this.criarBotaoEstudante(1420, 828, 'btnAnterior', 280, () => {
            if (this.indiceAtual > 0) {
                this.indiceAtual--;
                this.atualizarTela();
            }
        });

        // Botão PRÓXIMO (canto inferior direito na 1ª tela -> avança para a 2ª tela)
        this.btnProximo = this.criarBotaoEstudante(1420, 828, 'btnProximo', 280, () => {
            if (this.indiceAtual < this.totalTelas - 1) {
                this.indiceAtual++;
                this.atualizarTela();
            }
        });

        this.input.keyboard.on('keydown-RIGHT', () => {
            if (this.indiceAtual < this.totalTelas - 1) {
                this.indiceAtual++;
                this.atualizarTela();
            }
        });

        this.input.keyboard.on('keydown-LEFT', () => {
            if (this.indiceAtual > 0) {
                this.indiceAtual--;
                this.atualizarTela();
            }
        });

        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.start('ApoioPedagogico');
        });

        this.atualizarTela();
    }

    criarBotaoEstudante(x, y, chaveImagem, largura, acaoClique) {
        let botao = this.add.image(x, y, chaveImagem)
            .setInteractive({ useHandCursor: true })
            .setDepth(10);

        botao.displayWidth = largura;
        botao.scaleY = botao.scaleX;

        return aplicarEfeitoBotao(this, botao, acaoClique);
    }

    atualizarTela() {
        const numeroTela = this.indiceAtual + 1;
        this.imagemEstudante.setTexture(`telaMaterialEstudantes${numeroTela}`).setDisplaySize(1600, 900);

        if (this.indiceAtual === 0) {
            this.btnComponentesRevisao.setVisible(true).setInteractive({ useHandCursor: true });
            this.btnRevisao.setVisible(true).setInteractive({ useHandCursor: true });

            this.btnTelaInicial.setVisible(true).setPosition(180, 828);
            this.btnProximo.setVisible(true).setInteractive({ useHandCursor: true }).setPosition(1420, 828);
            this.btnAnterior.setVisible(false).disableInteractive();
        } else {
            this.btnComponentesRevisao.setVisible(false).disableInteractive();
            this.btnRevisao.setVisible(false).disableInteractive();

            this.btnTelaInicial.setVisible(true).setPosition(180, 828);
            this.btnAnterior.setVisible(true).setInteractive({ useHandCursor: true }).setPosition(1420, 828);
            this.btnProximo.setVisible(false).disableInteractive();
        }
    }
}


// ==========================================
// COMPONENTES E FUNÇÕES - NAVEGAÇÃO ENTRE AS 10 TELAS
// ==========================================
class ComponentesFuncoes extends Phaser.Scene {
    constructor() {
        super({ key: 'ComponentesFuncoes' });
    }

    preload() {
        this.totalTelas = 10;

        for (let i = 1; i <= this.totalTelas; i++) {
            this.load.image(`telaComponentes${i}`, `assets/tela_componentes${i}.png`);
        }

        this.load.on('loaderror', (file) => {
            if (file.key.startsWith('telaComponentes') && file.src.endsWith('.png')) {
                const num = file.key.replace('telaComponentes', '');
                this.load.image(file.key, `assets/tela_componentes${num}.jpg`);
            }
        });

        this.load.image('btnTelaInicial', 'assets/botao_telainicial.png');
        this.load.image('btnAnterior', 'assets/botal_anterior.png');
        this.load.image('btnProximo', 'assets/botao_proximo.png');
    }

    create() {
        this.indiceAtual = 0;

        this.imagemComponentes = this.add.image(800, 450, 'telaComponentes1').setDisplaySize(1600, 900);

        this.btnTelaInicial = this.criarBotaoComponentes('btnTelaInicial', () => {
            this.scene.start('ApoioPedagogico');
        });

        this.btnAnterior = this.criarBotaoComponentes('btnAnterior', () => {
            if (this.indiceAtual > 0) {
                this.indiceAtual--;
                this.atualizarTela();
            }
        });

        this.btnProximo = this.criarBotaoComponentes('btnProximo', () => {
            if (this.indiceAtual < this.totalTelas - 1) {
                this.indiceAtual++;
                this.atualizarTela();
            }
        });

        this.input.keyboard.on('keydown-RIGHT', () => {
            if (this.indiceAtual < this.totalTelas - 1) {
                this.indiceAtual++;
                this.atualizarTela();
            }
        });

        this.input.keyboard.on('keydown-LEFT', () => {
            if (this.indiceAtual > 0) {
                this.indiceAtual--;
                this.atualizarTela();
            }
        });

        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.start('ApoioPedagogico');
        });

        this.atualizarTela();
    }

    criarBotaoComponentes(chaveImagem, acaoClique) {
        let botao = this.add.image(0, 825, chaveImagem)
            .setInteractive({ useHandCursor: true })
            .setDepth(10);

        botao.displayWidth = 265;
        botao.scaleY = botao.scaleX;

        return aplicarEfeitoBotao(this, botao, acaoClique);
    }

    atualizarTela() {
        const numeroTela = this.indiceAtual + 1;
        this.imagemComponentes.setTexture(`telaComponentes${numeroTela}`).setDisplaySize(1600, 900);

        const posY = 825;

        if (this.indiceAtual === 0) {
            this.btnTelaInicial.setVisible(true).setPosition(612, posY);
            this.btnProximo.setVisible(true).setInteractive({ useHandCursor: true }).setPosition(966, posY);
            this.btnAnterior.setVisible(false).disableInteractive();
        } else if (this.indiceAtual === this.totalTelas - 1) {
            this.btnTelaInicial.setVisible(true).setPosition(612, posY);
            this.btnAnterior.setVisible(true).setInteractive({ useHandCursor: true }).setPosition(966, posY);
            this.btnProximo.setVisible(false).disableInteractive();
        } else {
            this.btnTelaInicial.setVisible(true).setPosition(385, posY);
            this.btnAnterior.setVisible(true).setInteractive({ useHandCursor: true }).setPosition(795, posY);
            this.btnProximo.setVisible(true).setInteractive({ useHandCursor: true }).setPosition(1205, posY);
        }
    }
}


// ==========================================
// REVISÃO - NAVEGAÇÃO ENTRE AS 5 TELAS + GABARITO
// ==========================================
class Revisao extends Phaser.Scene {
    constructor() {
        super({ key: 'Revisao' });
    }

    preload() {
        this.totalTelas = 5;

        for (let i = 1; i <= this.totalTelas; i++) {
            this.load.image(`telaRevisao${i}`, `assets/tela_revisao${i}.png`);
        }

        this.load.image('btnGabarito', 'assets/botao_gabarito.png');
        this.load.image('btnTelaInicial', 'assets/botao_telainicial.png');
        this.load.image('btnAnterior', 'assets/botal_anterior.png');
        this.load.image('btnProximo', 'assets/botao_proximo.png');

        this.load.on('loaderror', (file) => {
            if (file.key.startsWith('telaRevisao') && file.src.endsWith('.png')) {
                const num = file.key.replace('telaRevisao', '');
                this.load.image(file.key, `assets/tela_revisao${num}.jpg`);
            }
            if (file.key === 'btnGabarito' && file.src.endsWith('.png')) {
                this.load.image('btnGabarito', 'assets/botao_gabarito.jpg');
            }
        });
    }

    create() {
        this.indiceAtual = 0;

        // Imagem de fundo da tela atual de Revisão (tela_revisao1 até tela_revisao5)
        this.imagemRevisao = this.add.image(800, 450, 'telaRevisao1').setDisplaySize(1600, 900);

        // Botão GABARITO (exibido bem no meio na 5ª e última tela)
        this.btnGabarito = this.add.image(800, 690, 'btnGabarito')
            .setInteractive({ useHandCursor: true })
            .setDepth(10);
        this.btnGabarito.displayWidth = 320;
        this.btnGabarito.scaleY = this.btnGabarito.scaleX;

        aplicarEfeitoBotao(this, this.btnGabarito, () => {
            window.open(
                'https://docs.google.com/document/d/1tPRSKnRNxNI-R5UhratiSVHNmOZuxxwU5l4erCV5_nk/edit?tab=t.0',
                '_blank',
                'noopener,noreferrer'
            );
        });

        // Botão TELA INICIAL -> Volta para a tela de Apoio Pedagógico
        this.btnTelaInicial = this.criarBotaoRevisao('btnTelaInicial', () => {
            this.scene.start('ApoioPedagogico');
        });

        // Botão ANTERIOR -> Volta para a tela anterior
        this.btnAnterior = this.criarBotaoRevisao('btnAnterior', () => {
            if (this.indiceAtual > 0) {
                this.indiceAtual--;
                this.atualizarTela();
            }
        });

        // Botão PRÓXIMO -> Avança para a próxima tela
        this.btnProximo = this.criarBotaoRevisao('btnProximo', () => {
            if (this.indiceAtual < this.totalTelas - 1) {
                this.indiceAtual++;
                this.atualizarTela();
            }
        });

        this.input.keyboard.on('keydown-RIGHT', () => {
            if (this.indiceAtual < this.totalTelas - 1) {
                this.indiceAtual++;
                this.atualizarTela();
            }
        });

        this.input.keyboard.on('keydown-LEFT', () => {
            if (this.indiceAtual > 0) {
                this.indiceAtual--;
                this.atualizarTela();
            }
        });

        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.start('ApoioPedagogico');
        });

        this.atualizarTela();
    }

    criarBotaoRevisao(chaveImagem, acaoClique) {
        let botao = this.add.image(0, 825, chaveImagem)
            .setInteractive({ useHandCursor: true })
            .setDepth(10);

        botao.displayWidth = 265;
        botao.scaleY = botao.scaleX;

        return aplicarEfeitoBotao(this, botao, acaoClique);
    }

    atualizarTela() {
        const numeroTela = this.indiceAtual + 1;
        this.imagemRevisao.setTexture(`telaRevisao${numeroTela}`).setDisplaySize(1600, 900);

        const posY = 825;

        if (this.indiceAtual === 0) {
            this.btnTelaInicial.setVisible(true).setPosition(612, posY);
            this.btnProximo.setVisible(true).setInteractive({ useHandCursor: true }).setPosition(966, posY);
            this.btnAnterior.setVisible(false).disableInteractive();
            this.btnGabarito.setVisible(false).disableInteractive();
        } else if (this.indiceAtual === this.totalTelas - 1) {
            this.btnTelaInicial.setVisible(true).setPosition(612, posY);
            this.btnAnterior.setVisible(true).setInteractive({ useHandCursor: true }).setPosition(966, posY);
            this.btnProximo.setVisible(false).disableInteractive();
            this.btnGabarito.setVisible(true).setInteractive({ useHandCursor: true });
        } else {
            this.btnTelaInicial.setVisible(true).setPosition(385, posY);
            this.btnAnterior.setVisible(true).setInteractive({ useHandCursor: true }).setPosition(795, posY);
            this.btnProximo.setVisible(true).setInteractive({ useHandCursor: true }).setPosition(1205, posY);
            this.btnGabarito.setVisible(false).disableInteractive();
        }
    }
}


// ==========================================
// TELA DE CRÉDITOS - NAVEGAÇÃO ENTRE AS 12 TELAS
// ==========================================
class Creditos extends Phaser.Scene {
    constructor() {
        super({ key: 'Creditos' });
    }

    init(data) {
        this.telaOrigem = (data && data.origem) ? data.origem : 'MenuInicial';
    }

    preload() {
        this.totalTelas = 12;

        for (let i = 1; i <= this.totalTelas; i++) {
            this.load.image(`telaCreditos${i}`, `assets/tela_creditos${i}.png`);
        }

        this.load.on('loaderror', (file) => {
            if (file.key.startsWith('telaCreditos') && file.src.endsWith('.png')) {
                const num = file.key.replace('telaCreditos', '');
                this.load.image(file.key, `assets/tela_creditos${num}.jpg`);
            }
        });

        this.load.image('btnTelaInicial', 'assets/botao_telainicial.png');
        this.load.image('btnAnterior', 'assets/botal_anterior.png');
        this.load.image('btnProximo', 'assets/botao_proximo.png');
    }

    create() {
        this.indiceAtual = 0;

        this.imagemCreditos = this.add.image(800, 450, 'telaCreditos1').setDisplaySize(1600, 900);

        this.btnTelaInicial = this.criarBotaoCreditos('btnTelaInicial', () => {
            this.scene.start(this.telaOrigem);
        });

        this.btnAnterior = this.criarBotaoCreditos('btnAnterior', () => {
            if (this.indiceAtual > 0) {
                this.indiceAtual--;
                this.atualizarTela();
            }
        });

        this.btnProximo = this.criarBotaoCreditos('btnProximo', () => {
            if (this.indiceAtual < this.totalTelas - 1) {
                this.indiceAtual++;
                this.atualizarTela();
            }
        });

        this.input.keyboard.on('keydown-RIGHT', () => {
            if (this.indiceAtual < this.totalTelas - 1) {
                this.indiceAtual++;
                this.atualizarTela();
            }
        });

        this.input.keyboard.on('keydown-LEFT', () => {
            if (this.indiceAtual > 0) {
                this.indiceAtual--;
                this.atualizarTela();
            }
        });

        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.start(this.telaOrigem);
        });

        this.atualizarTela();
    }

    criarBotaoCreditos(chaveImagem, acaoClique) {
        let botao = this.add.image(0, 825, chaveImagem)
            .setInteractive({ useHandCursor: true })
            .setDepth(10);

        botao.displayWidth = 265;
        botao.scaleY = botao.scaleX;

        return aplicarEfeitoBotao(this, botao, acaoClique);
    }

    atualizarTela() {
        const numeroTela = this.indiceAtual + 1;
        this.imagemCreditos.setTexture(`telaCreditos${numeroTela}`).setDisplaySize(1600, 900);

        const posY = 825;

        if (this.indiceAtual === 0) {
            this.btnTelaInicial.setVisible(true).setPosition(612, posY);
            this.btnProximo.setVisible(true).setInteractive({ useHandCursor: true }).setPosition(966, posY);
            this.btnAnterior.setVisible(false).disableInteractive();
        } else if (this.indiceAtual === this.totalTelas - 1) {
            this.btnTelaInicial.setVisible(true).setPosition(612, posY);
            this.btnAnterior.setVisible(true).setInteractive({ useHandCursor: true }).setPosition(966, posY);
            this.btnProximo.setVisible(false).disableInteractive();
        } else {
            this.btnTelaInicial.setVisible(true).setPosition(385, posY);
            this.btnAnterior.setVisible(true).setInteractive({ useHandCursor: true }).setPosition(795, posY);
            this.btnProximo.setVisible(true).setInteractive({ useHandCursor: true }).setPosition(1205, posY);
        }
    }
}


// ==========================================
// FASE 1 - O PRIMEIRO TABULEIRO
// ==========================================
class Fase1 extends Phaser.Scene {
    constructor() {
        super({ key: 'Fase1' });
    }

    init(data) {
        this.tempoSegundos = (data && data.tempoSegundos) ? data.tempoSegundos : 0;
    }

    preload() {
        this.load.image('tabuleiroFundo1', 'assets/tabuleiro_fundo1.png');
        this.load.image('pixu', 'assets/pixu.png');
        this.load.image('imgDado', 'assets/dado.png'); 
        this.load.image('botaoVoltar', 'assets/botao_voltar.png');

        this.load.image('telaRespostaCerta', 'assets/tela_respostacerta.png');
        this.load.image('telaRespostaErrada', 'assets/tela_respostaerrada.png');
        this.load.image('telaBonus', 'assets/tela_bonus.png');
        this.load.image('telaEntreFases', 'assets/tela_entrefases.png');
        this.load.on('loaderror', (file) => {
            if (file.key === 'telaBonus' && file.src.endsWith('.png')) {
                this.load.image('telaBonus', 'assets/tela_bonus.jpg');
            }
            if (file.key === 'telaEntreFases' && file.src.endsWith('.png')) {
                this.load.image('telaEntreFases', 'assets/tela_entrefases.jpg');
            }
        });
        this.load.image('btnContinuar', 'assets/botao_continuar.png');
        this.load.image('btnTelaInicial', 'assets/botao_telainicial.png');

        this.load.image('teclaNormal', 'assets/tecla_normal.png');
        this.load.image('teclaBonus', 'assets/tecla_bonus.png');
        this.load.image('teclaBonusVertical', 'assets/tecla_bonusvertical.png');
        this.load.image('teclaPergunta', 'assets/tecla_pergunta.png');
        
        this.load.image('telaCaixaSom1', 'assets/tela_caixasom1.png'); 
        this.load.image('telaCaixaSom2', 'assets/tela_caixasom2.png'); 
        this.load.image('telaCaixaSom3', 'assets/tela_caixasom3.png');
        
        this.load.image('telaMouse1', 'assets/tela_mouse1.png');
        this.load.image('telaMouse2', 'assets/tela_mouse2.png');
        this.load.image('telaMouse3', 'assets/tela_mouse3.png');
        
        this.load.image('telaMonitor1', 'assets/tela_monitor1.png');
        this.load.image('telaMonitor2', 'assets/tela_monitor2.png');
        this.load.image('telaMonitor3', 'assets/tela_monitor3.png');
        
        this.load.image('telaFonte1', 'assets/tela_fonte1.png');
        this.load.image('telaFonte2', 'assets/tela_fonte2.png');
        this.load.image('telaFonte3', 'assets/tela_fonte3.png');
        
        this.load.image('telaTeclado1', 'assets/tela_teclado1.png');
        this.load.image('telaTeclado2', 'assets/tela_teclado2.png');
        this.load.image('telaTeclado3', 'assets/tela_teclado3.png');
    }

    create() {
        this.add.image(800, 450, 'tabuleiroFundo1').setDisplaySize(1600, 900);

        let btnVoltar = this.add.image(130, 835, 'botaoVoltar')
            .setInteractive({ useHandCursor: true })
            .setScale(0.8); 

        aplicarEfeitoBotao(this, btnVoltar, () => {
            if (confirm("Tem a certeza de que deseja voltar ao menu inicial? O progresso será perdido.")) {
                if (this.timerJogo) this.timerJogo.remove();
                this.scene.start('MenuInicial');
            }
        });

        this.textoTempo = this.add.text(840, 833, '00:00', {
            fontSize: '24px', fill: '#ffffff', fontStyle: 'bold'
        }).setOrigin(0.5);

        this.atualizarTextoTempo();

        this.timerJogo = this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.tempoSegundos++;
                this.atualizarTextoTempo();
            },
            callbackScope: this,
            loop: true
        });

        this.bancoDePerguntas = {
            'Caixas de Som': [
                { imagemTela: 'telaCaixaSom2', pergunta: 'As caixas de som podem ser conectadas via Bluetooth e por:', respostaCorreta: ['cabos', 'cabo'] },
                { imagemTela: 'telaCaixaSom3', pergunta: 'As caixas de som são dispositivos de entrada ou saída?', respostaCorreta: ['saida'] },
                { imagemTela: 'telaCaixaSom1', pergunta: 'De acordo com o texto, que tipos de sons as caixas de som reproduzem?', respostaCorreta: ['qualidade'] }
            ],
            'Mouse': [
                { imagemTela: 'telaMouse1', pergunta: 'O mouse é considerado um dispositivo de entrada ou de saída?', respostaCorreta: ['entrada'] },
                { imagemTela: 'telaMouse2', pergunta: 'O QUE O MOUSE PERMITE AO USUÁRIO CONTROLAR NA TELA?', respostaCorreta: ['cursor', 'ponteiro'] },
                { imagemTela: 'telaMouse3', pergunta: 'PARA QUE TIPO DE NAVEGAÇÃO O MOUSE É ESSENCIAL??', respostaCorreta: ['ambientes graficos', 'graficos'] }
            ],
            'Monitor': [
                { 
                    imagemTela: 'telaMonitor1', 
                    pergunta: 'QUAL É O PRINCIPAL DISPOSITIVO DE SAÍDA VISUAL DE UM COMPUTADOR, MENCIONADO NO TEXTO?', 
                    respostaCorreta: ['monitor', 'monitores'] 
                },
                { 
                    imagemTela: 'telaMonitor2', 
                    pergunta: 'CITE DUAS TECNOLOGIAS DE MONITORES MENCIONADAS NO TEXTO.', 
                    respostaCorreta: ['lcd', 'led', 'oled'] 
                },
                { 
                    imagemTela: 'telaMonitor3', 
                    pergunta: 'DE ACORDO COM O TEXTO, PARA QUAIS TIPOS DE ATIVIDADES OS MONITORES SÃO ESSENCIAIS?', 
                    respostaCorreta: ['imagem', 'design', 'edicao', 'video', 'jogos'] 
                }
            ],
            'Fonte de Alimentação': [
                { 
                    imagemTela: 'telaFonte1', 
                    pergunta: 'O QUE A FFONTE DISTRIBUI AOS COMPONENTES?', 
                    respostaCorreta: ['energia', 'energia de forma segura'] 
                },
                { 
                    imagemTela: 'telaFonte2', 
                    pergunta: 'O QUE A FONTE DE ALIMENTAÇÃO CONVERTE?', 
                    respostaCorreta: ['energia alternada', 'alternada', 'energia continua', 'continua'] 
                },
                { 
                    imagemTela: 'telaFonte3', 
                    pergunta: 'O QUE A POTÊNCIA DA FONTE INFLUÊNCIA?', 
                    respostaCorreta: ['desempenho', 'durabilidade', 'desempenho e durabilidade'] 
                }
            ],
            'Teclado': [
                { 
                    imagemTela: 'telaTeclado1', 
                    pergunta: 'O TECLADO É UM PERIFÉRICO DE ENTRADA OU SAÍDA?', 
                    respostaCorreta: ['entrada'] 
                },
                { 
                    imagemTela: 'telaTeclado2', 
                    pergunta: 'QUE TIPO DE TECLA PERMITE DIGITAR LETRAS E NÚMEROS?', 
                    respostaCorreta: ['alfanumericas'] 
                },
                { 
                    imagemTela: 'telaTeclado3', 
                    pergunta: 'QUAL MODELO DE TECLADO É IDEAL PARA JOGOS?', 
                    respostaCorreta: ['mecanico', 'mecanicos', 'teclados mecanicos'] 
                }
            ]
        };

        this.caminhoCasas = [
            { x: 35, y: 200, tipo: 'teclaNormal' },
            { x: 140, y: 200, tipo: 'teclaBonus' },
            { x: 260, y: 200, tipo: 'teclaPergunta', componente: 'Mouse' },
            { x: 260, y: 280, tipo: 'teclaNormal' },
            { x: 260, y: 350, tipo: 'teclaNormal' },
            { x: 260, y: 470, tipo: 'teclaBonusVertical' }, 
            { x: 260, y: 580, tipo: 'teclaNormal' },
            { x: 260, y: 660, tipo: 'teclaPergunta', componente: 'Monitor' },
            { x: 375, y: 660, tipo: 'teclaBonus' },
            { x: 490, y: 660, tipo: 'teclaNormal' },
            { x: 565, y: 660, tipo: 'teclaNormal' },
            { x: 565, y: 575, tipo: 'teclaNormal' },
            { x: 565, y: 500, tipo: 'teclaNormal' },
            { x: 565, y: 420, tipo: 'teclaNormal' },
            { x: 600, y: 340, tipo: 'teclaBonus' },
            { x: 715, y: 340, tipo: 'teclaPergunta', componente: 'Fonte de Alimentação' },
            { x: 790, y: 340, tipo: 'teclaNormal' },
            { x: 875, y: 340, tipo: 'teclaNormal' },
            { x: 875, y: 420, tipo: 'teclaNormal' },
            { x: 875, y: 500, tipo: 'teclaNormal' },
            { x: 875, y: 575, tipo: 'teclaNormal' },
            { x: 990, y: 575, tipo: 'teclaBonus' },
            { x: 1100, y: 575, tipo: 'teclaPergunta', componente: 'Teclado' },
            { x: 1100, y: 495, tipo: 'teclaNormal' },
            { x: 1100, y: 415, tipo: 'teclaNormal' },
            { x: 1100, y: 340, tipo: 'teclaNormal' },
            { x: 1100, y: 265, tipo: 'teclaNormal' },
            { x: 1215, y: 265, tipo: 'teclaBonus' },
            { x: 1325, y: 265, tipo: 'teclaPergunta', componente: 'Caixas de Som' },
            { x: 1325, y: 335, tipo: 'teclaNormal' },
            { x: 1325, y: 440, tipo: 'teclaBonusVertical' }, 
            { x: 1325, y: 560, tipo: 'teclaNormal' },
            { x: 1325, y: 640, tipo: 'teclaNormal' },
            { x: 1400, y: 640, tipo: 'teclaNormal' },
            { x: 1480, y: 640, tipo: 'teclaNormal' },
            { x: 1560, y: 640, tipo: 'teclaNormal', fim: true }
        ];

        this.caminhoCasas.forEach((casa) => {
            this.add.image(casa.x, casa.y, casa.tipo).setScale(0.8);
        });

        this.posicaoAtual = 0;
        this.pixu = this.add.image(this.caminhoCasas[0].x, this.caminhoCasas[0].y, 'pixu').setScale(0.7).setDepth(20);

        this.btnDado = this.add.image(745, 545, 'imgDado')
            .setInteractive({ useHandCursor: true })
            .setScale(0.8); 

        // Hover com zoom leve também no dado
        this.btnDado.on('pointerover', () => {
            this.btnDado.setTint(0xf4f4f4);
            this.tweens.add({ targets: this.btnDado, scale: 0.88, duration: 120, ease: 'Back.easeOut' });
        });
        this.btnDado.on('pointerout', () => {
            this.btnDado.clearTint();
            this.tweens.add({ targets: this.btnDado, scale: 0.8, duration: 120, ease: 'Power2' });
        });
        this.btnDado.on('pointerdown', () => {
            this.btnDado.setScale(0.8);
            this.animarERolarDado();
        });
    }

    animarERolarDado() {
        this.btnDado.disableInteractive(); 
        this.btnDado.clearTint();

        this.tweens.add({
            targets: this.btnDado,
            angle: '+=720', 
            duration: 800, 
            ease: 'Cubic.easeOut', 
            onComplete: () => {
                let passosSorteados = Phaser.Math.Between(1, 6);
                
                let avisoPassos = this.add.text(this.btnDado.x, this.btnDado.y + 70, `+${passosSorteados}`, {
                    fontSize: '36px', fill: '#00ff00', fontStyle: 'bold', stroke: '#000000', strokeThickness: 5
                }).setOrigin(0.5).setDepth(30);

                this.tweens.add({
                    targets: avisoPassos,
                    y: avisoPassos.y - 50,
                    alpha: 0,
                    duration: 1000,
                    onComplete: () => {
                        avisoPassos.destroy();
                        this.avancarTabuleiro(passosSorteados); 
                    }
                });
            }
        });
    }

    atualizarTextoTempo() {
        let minutos = Math.floor(this.tempoSegundos / 60);
        let segundos = this.tempoSegundos % 60;
        let minFormatado = String(minutos).padStart(2, '0');
        let segFormatado = String(segundos).padStart(2, '0');

        if (this.textoTempo) {
            this.textoTempo.setText(`${minFormatado}:${segFormatado}`);
        }
    }

    avancarTabuleiro(passos) {
        this.btnDado.setAlpha(0.5); 
        this.moverPassoAPasso(passos); 
    }

    moverPassoAPasso(passosRestantes) {
        if (passosRestantes <= 0 || this.posicaoAtual >= this.caminhoCasas.length - 1) {
            let casaAtual = this.caminhoCasas[this.posicaoAtual];
            this.checarTipoCasa(casaAtual);
            return;
        }

        this.posicaoAtual++;
        let proximaCasa = this.caminhoCasas[this.posicaoAtual];

        this.tweens.add({
            targets: this.pixu,
            x: proximaCasa.x,
            y: proximaCasa.y,
            duration: 300,
            ease: 'Linear',
            onComplete: () => {
                if (proximaCasa.tipo === 'teclaPergunta' || proximaCasa.fim === true) {
                    this.checarTipoCasa(proximaCasa);
                } else {
                    this.moverPassoAPasso(passosRestantes - 1);
                }
            }
        });
    }

    checarTipoCasa(casa) {
        if (casa.tipo === 'teclaBonus' || casa.tipo === 'teclaBonusVertical') {
            this.mostrarTelaBonus(3);
            return;
        }

        if (casa.tipo === 'teclaPergunta') {
            this.mostrarTelaPergunta(casa.componente);
        } else if (casa.fim === true) {
            if (this.timerJogo) this.timerJogo.remove();
            this.mostrarTelaEntreFases();
        } else {
            this.btnDado.setAlpha(1).setInteractive(); 
        }
    }

    mostrarTelaEntreFases() {
        let entreFasesContainer = this.add.container(0, 0).setDepth(1200);

        let imagemEntreFases = this.add.image(800, 450, 'telaEntreFases').setDisplaySize(1600, 900);

        let btnContinuar = this.add.image(1000, 637, 'btnContinuar')
            .setInteractive({ useHandCursor: true });
        btnContinuar.displayWidth = 356;
        btnContinuar.scaleY = btnContinuar.scaleX;

        aplicarEfeitoBotao(this, btnContinuar, () => {
            entreFasesContainer.destroy();
            this.scene.start('Fase2', { tempoSegundos: this.tempoSegundos });
        });

        let btnTelaInicial = this.add.image(214, 818, 'btnTelaInicial')
            .setInteractive({ useHandCursor: true });
        btnTelaInicial.displayWidth = 265;
        btnTelaInicial.scaleY = btnTelaInicial.scaleX;

        aplicarEfeitoBotao(this, btnTelaInicial, () => {
            entreFasesContainer.destroy();
            this.scene.start('MenuInicial');
        });

        entreFasesContainer.add([imagemEntreFases, btnContinuar, btnTelaInicial]);
    }

    mostrarTelaBonus(casasBonus = 3) {
        let bonusContainer = this.add.container(0, 0).setDepth(1100);

        let fundoEscuro = this.add.rectangle(800, 450, 1600, 900, 0x000000, 0.7);
        fundoEscuro.setInteractive();

        let imagemBonus = this.add.image(800, 450, 'telaBonus');

        let posXNumero = imagemBonus.x + (imagemBonus.displayWidth * 0.17);
        let posYNumero = imagemBonus.y + (imagemBonus.displayHeight * 0.03);

        let textoBonus = this.add.text(posXNumero, posYNumero, `${casasBonus}`, {
            fontSize: '58px',
            fill: '#1e3a8a',
            fontFamily: 'sans-serif',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        let posYBotao = imagemBonus.y + (imagemBonus.displayHeight * 0.385);
        let btnContinuar = this.add.image(800, posYBotao, 'btnContinuar')
            .setInteractive({ useHandCursor: true });

        btnContinuar.displayWidth = imagemBonus.displayWidth * 0.39;
        btnContinuar.scaleY = btnContinuar.scaleX;

        aplicarEfeitoBotao(this, btnContinuar, () => {
            bonusContainer.destroy();
            this.moverPassoAPasso(casasBonus);
        });

        bonusContainer.add([fundoEscuro, imagemBonus, textoBonus, btnContinuar]);
    }

    mostrarTelaPergunta(nomeComponente, perguntaAtual = null) {
        let listaPerguntas = this.bancoDePerguntas[nomeComponente];
        if (!listaPerguntas || listaPerguntas.length === 0) return; 

        let dados = perguntaAtual;
        if (!dados) {
            let indiceSorteado = Phaser.Math.Between(0, listaPerguntas.length - 1);
            dados = listaPerguntas[indiceSorteado];
        }

        let painelContainer = this.add.container(0, 0).setDepth(1000);

        let fundoEscuro = this.add.rectangle(800, 450, 1600, 900, 0x000000, 0.6);
        fundoEscuro.setInteractive();

        let imagemCompleta = this.add.image(800, 450, dados.imagemTela);
        painelContainer.add([fundoEscuro, imagemCompleta]);

        criarCampoRespostaResponsivo(this, 'Digite aqui...', (respostaJogador, limparCampo) => {
            let rLimpa = respostaJogador.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            let acertou = false;

            if (Array.isArray(dados.respostaCorreta)) {
                acertou = dados.respostaCorreta.some(opcao => {
                    let correta = opcao.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                    return rLimpa.includes(correta);
                });
            } else {
                let correta = dados.respostaCorreta.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                acertou = rLimpa.includes(correta);
            }

            limparCampo();
            painelContainer.destroy();

            this.mostrarTelaFeedback(acertou, nomeComponente, dados);
        });
    }

    mostrarTelaFeedback(acertou, nomeComponente, dados) {
        let feedbackContainer = this.add.container(0, 0).setDepth(1100);

        let fundoEscuro = this.add.rectangle(800, 450, 1600, 900, 0x000000, 0.7);
        fundoEscuro.setInteractive();

        let chaveImagem = acertou ? 'telaRespostaCerta' : 'telaRespostaErrada';
        let imagemFeedback = this.add.image(800, 450, chaveImagem);

        let posYBotao = imagemFeedback.y + (imagemFeedback.displayHeight * 0.385);
        let btnContinuar = this.add.image(800, posYBotao, 'btnContinuar')
            .setInteractive({ useHandCursor: true });

        btnContinuar.displayWidth = imagemFeedback.displayWidth * 0.39;
        btnContinuar.scaleY = btnContinuar.scaleX;

        aplicarEfeitoBotao(this, btnContinuar, () => {
            feedbackContainer.destroy();
            if (acertou) {
                this.btnDado.setAlpha(1).setInteractive();
            } else {
                this.mostrarTelaPergunta(nomeComponente, dados);
            }
        });

        feedbackContainer.add([fundoEscuro, imagemFeedback, btnContinuar]);
    }
}


// ==========================================
// FASE 2 - DESAFIO FINAL (MECÂNICAS COMPLETAS)
// ==========================================
class Fase2 extends Phaser.Scene {
    constructor() {
        super({ key: 'Fase2' });
    }

    init(data) {
        this.tempoSegundos = (data && data.tempoSegundos) ? data.tempoSegundos : 0;
    }

    preload() {
        this.load.image('tabuleiroFundo2', 'assets/tabuleiro_fundo2.png'); 
        this.load.image('pixu', 'assets/pixu.png');
        this.load.image('imgDado', 'assets/dado.png'); 
        this.load.image('botaoVoltar', 'assets/botao_voltar.png');

        this.load.image('telaRespostaCerta', 'assets/tela_respostacerta.png');
        this.load.image('telaRespostaErrada', 'assets/tela_respostaerrada.png');
        this.load.image('telaBonus', 'assets/tela_bonus.png');
        this.load.on('loaderror', (file) => {
            if (file.key === 'telaBonus' && file.src.endsWith('.png')) {
                this.load.image('telaBonus', 'assets/tela_bonus.jpg');
            }
        });
        this.load.image('btnContinuar', 'assets/botao_continuar.png');

        this.load.image('telaFinal', 'assets/tela_final.png');
        this.load.image('btnRecomecar', 'assets/botao_recomecar.png');
        this.load.image('btnVoltarMenu', 'assets/botao_voltarmenu.png');
        this.load.image('btnSair', 'assets/botao_sair.png');

        this.load.image('teclaNormal', 'assets/tecla_normal.png');
        this.load.image('teclaBonus', 'assets/tecla_bonus.png');
        this.load.image('teclaBonusVertical', 'assets/tecla_bonusvertical.png');
        this.load.image('teclaPergunta', 'assets/tecla_pergunta.png');
        
        this.load.image('telaCooler1', 'assets/tela_cooler1.png'); 
        this.load.image('telaCooler2', 'assets/tela_cooler2.png'); 
        this.load.image('telaCooler3', 'assets/tela_cooler3.png');
        
        this.load.image('telaCpu1', 'assets/tela_cpu1.png');
        this.load.image('telaCpu2', 'assets/tela_cpu2.png');
        this.load.image('telaCpu3', 'assets/tela_cpu3.png');
        
        this.load.image('telaGabinete1', 'assets/tela_gabinete1.png');
        this.load.image('telaGabinete2', 'assets/tela_gabinete2.png');
        this.load.image('telaGabinete3', 'assets/tela_gabinete3.png');

        this.load.image('telaHd1', 'assets/tela_hd1.png');
        this.load.image('telaHd2', 'assets/tela_hd2.png');
        this.load.image('telaHd3', 'assets/tela_hd3.png');

        this.load.image('telaPlacaVideo1', 'assets/tela_video1.png');
        this.load.image('telaPlacaVideo2', 'assets/tela_video2.png');
        this.load.image('telaPlacaVideo3', 'assets/tela_video3.png');

        this.load.image('telaRam1', 'assets/tela_ram1.png');
        this.load.image('telaRam2', 'assets/tela_ram2.png');
        this.load.image('telaRam3', 'assets/tela_ram3.png');

        this.load.image('telaSsd1', 'assets/tela_ssd1.png');
        this.load.image('telaSsd2', 'assets/tela_ssd2.png');
        this.load.image('telaSsd3', 'assets/tela_ssd3.png');

        this.load.image('telaPlacaMae1', 'assets/tela_placamae1.png');
        this.load.image('telaPlacaMae2', 'assets/tela_placamae2.png');
        this.load.image('telaPlacaMae3', 'assets/tela_placamae3.png');
    }

    create() {
        this.add.image(800, 450, 'tabuleiroFundo2').setDisplaySize(1600, 900);

        let btnVoltar = this.add.image(130, 835, 'botaoVoltar')
            .setInteractive({ useHandCursor: true })
            .setScale(0.8); 

        aplicarEfeitoBotao(this, btnVoltar, () => {
            if (confirm("Tem a certeza de que deseja voltar ao menu inicial? O progresso será perdido.")) {
                if (this.timerFase2) this.timerFase2.remove();
                this.scene.start('MenuInicial');
            }
        });

        this.textoTempo = this.add.text(840, 833, '00:00', {
            fontSize: '24px', fill: '#ffffff', fontStyle: 'bold'
        }).setOrigin(0.5);

        this.atualizarTextoTempo();

        this.timerFase2 = this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.tempoSegundos++;
                this.atualizarTextoTempo();
            },
            callbackScope: this,
            loop: true
        });

        this.bancoDePerguntas = {
            'Cooler': [
                { 
                    imagemTela: 'telaCooler1', 
                    pergunta: 'QUAL A FUNÇÃO PRINCIPAL DO COOLER?', 
                    respostaCorreta: ['temperatura', 'manter a temperatura', 'resfriar', 'resfriamento', 'arrefecimento', 'manter o sistema resfriado', 'manter o sistema resfriado e evitar superaquecimento'  ] 
                }, 
                { 
                    imagemTela: 'telaCooler2', 
                    pergunta: 'O QUE O COOLER EVITA AO DISSIPAR O CALOR GERADO PELO SISTEMA?', 
                    respostaCorreta: ['superaquecimento', 'o superaquecimento', 'danos pelo calor', 'aquecimento excessivo','danos ao sistema', 'danos ao computador'] 
                },
                { 
                    imagemTela: 'telaCooler3', 
                    pergunta: 'QUAIS SÃO OS DOIS TIPOS DE COOLERS MENCIONADOS NO TEXTO?', 
                    respostaCorreta: ['ar', 'liquido', 'agua', 'ar e liquido', 'ar e agua', 'liquido e ar', 'liquido e agua'] 
                } 
            ],
            'Processador': [
                { imagemTela: 'telaCpu1', pergunta: 'QUAL COMPONENTE É CONSIDERADO O "CÉREBRO" DO COMPUTADOR?', respostaCorreta: ['cpu', 'processador'] },
                { imagemTela: 'telaCpu2', pergunta: 'O QUE A POTÊNCIA DA FONTE INFLUENCIA?', respostaCorreta: ['performance', 'desempenho'] }, 
                { imagemTela: 'telaCpu3', pergunta: 'A CPU REALIZA CÁLCULOS E OPERAÇÕES DE QUE TIPO?', respostaCorreta: ['logicas', 'logica', 'logico', 'lógicas', 'lógico'] }
            ],
            'Gabinete': [
                { imagemTela: 'telaGabinete2', pergunta: 'O QUE O GABINETE AJUDA A MANTER NO SISTEMA?', respostaCorreta: ['organizacao', 'ventilacao','componentes', 'organização','protecao', 'proteção'] },
                { imagemTela: 'telaGabinete3', pergunta: 'O GABINETE ACOMODA OS COMPONENTES DE QUAL PARTE DO COMPUTADOR?', respostaCorreta: ['internos', 'interna'] },
                { imagemTela: 'telaGabinete1', pergunta: 'O QUE O GABINETE AJUDA A EVITAR NO FUNCIONAMENTO DO COMPUTADOR?', respostaCorreta: ['superaquecimento'] }
            ],
            'Placa de Vídeo': [
                { 
                    imagemTela: 'telaPlacaVideo1', 
                    pergunta: 'QUAL COMPONENTE PROCESSA E EXIBE IMAGENS NO MONITOR?', 
                    respostaCorreta: ['placa de video', 'video', 'gpu', 'placa de vídeo', 'placa de vídeo dedicada', 'placa de video dedicada'] 
                },
                { 
                    imagemTela: 'telaPlacaVideo2', 
                    pergunta: 'EM QUAIS APLICAÇÕES A PLACA DE VÍDEO GARANTE ALTO DESEMPENHO?', 
                    respostaCorreta: ['jogos', 'edicao', 'aplicacoes visuais', 'jogos, softwares de edicao', 'jogos e edicao'] 
                },
                { 
                    imagemTela: 'telaPlacaVideo3', 
                    pergunta: 'EM COMPARAÇÃO ÀS INTEGRADAS, A GPU CONSOME MAIS O QUÊ?', 
                    respostaCorreta: ['energia', 'energia eletrica', 'energia eletrica e energia', 'energia eletrica e energia eletrica'] 
                }
            ],
            'Memória RAM': [
                { 
                    imagemTela: 'telaRam1', 
                    pergunta: 'QUE TIPO DE MEMÓRIA É A RAM?', 
                    respostaCorreta: ['volatil', 'memoria volatil', 'temporaria'] 
                },
                { 
                    imagemTela: 'telaRam2', 
                    pergunta: 'QUEM ACESSA OS DADOS DA RAM?', 
                    respostaCorreta: ['processador', 'o processador', 'cpu'] 
                },
                { 
                    imagemTela: 'telaRam3', 
                    pergunta: 'A RAM É UMA MEMÓRIA "VOLÁTIL". O QUE ACONTECE COM A RAM QUANDO O COMPUTADOR É DESLIGADO DA ENERGIA?', 
                    respostaCorreta: ['perdidos', 'sao perdidos', 'apagados', 'sao apagados', 'perde os dados', 'dados sao perdidos', 'dados sao apagados'] 
                }
            ],
            'SSD': [
                { 
                    imagemTela: 'telaSsd1', 
                    pergunta: 'QUE TIPO DE MEMÓRIA É UTILIZADA PELOS SSDS?', 
                    respostaCorreta: ['flash', 'memoria flash'] 
                },
                { 
                    imagemTela: 'telaSsd2', 
                    pergunta: 'OS SDDS POSSUEM PARTES FÍSICAS MÓVEIS OU NÃO?', 
                    respostaCorreta: ['nao', 'nao possuem', 'nao possuem partes moveis', 'nao possuem partes movéis'] 
                },
                { 
                    imagemTela: 'telaSsd3', 
                    pergunta: 'OS SSDS NÃO POSSUEM PARTES MÓVEIS, QUAL BENEFÍCIO DIRETO, ASSOCIADO Á RESISTÊNCIA E VIDA ÚTIL, É DESTACADO POR CAUSA DISSO?', 
                    respostaCorreta: ['durabilidade', 'maior durabilidade', 'resistencia', 'maior resistencia', 'rapidez', 'eficiencia', 'maior durabilidade e resistencia', 'maior durabilidade e maior resistencia'] 
                }
            ],
            'Placa-mãe': [
                { 
                    imagemTela: 'telaPlacaMae1', 
                    pergunta: 'QUAL COMPONENTE CONECTA OS ELEMENTOS INTERNOS DE UM COMPUTADOR?', 
                    respostaCorreta: ['placa-mae', 'placa mae', 'mae', 'motherboard', 'placa-mãe'] 
                },
                { 
                    imagemTela: 'telaPlacaMae2', 
                    pergunta: 'QUE TIPO DE MEMÓRIA A PLACA-MÃE CONECTA?', 
                    respostaCorreta: ['ram', 'memoria ram', 'memoria'] 
                },
                { 
                    imagemTela: 'telaPlacaMae3', 
                    pergunta: 'O QUE A PLACA-MÇAE FORNECE PARA OS CMPONENTES FUNCIONAREM?', 
                    respostaCorreta: ['conexoes', 'slots', 'conexoes e slots', 'conexoes e os slots', 'conexoes e slots para os componentes'] 
                }
            ],
            'HD': [
                { imagemTela: 'telaHd1', pergunta: 'O TEXTO APONTA QUE OS HDDS UTILIZAM UM PRINCÍPIO FÍSICO ESPECÍFICO PARA SALVAR DADOS. QUAL É ESSE PRINCÍPIO?', respostaCorreta: ['magnetismo', 'magnetismo eletromagnetico'] },
                { imagemTela: 'telaHd2', pergunta: 'AO CONTRÁRIO DA MEMÓRIA RAM, O HD ARMAZENA DADOS DE FORMA PERMANENTE OU TEMPORÁRIA?', respostaCorreta: ['permanente'] },
                { imagemTela: 'telaHd3', pergunta: 'QUAL É A CARACTERÍSTICA ESTRUTURAL DOS HDDS CITADOS NO TEXTO, QUE OS TORNA MAIS SUCETÍVEIS AO DESGASTE FÍSICO EM COMPARAÇÃO AOS SDDS?', respostaCorreta: ['moveis', 'partes moveis', 'partes movéis'] }
            ]
        };

        this.caminhoCasas = [
            { x: 29,   y: 741, tipo: 'teclaNormal' },
            { x: 107,  y: 741, tipo: 'teclaNormal' },
            { x: 185,  y: 741, tipo: 'teclaNormal' },
            { x: 264,  y: 741, tipo: 'teclaNormal' },
            { x: 264,  y: 672, tipo: 'teclaNormal' },
            { x: 264,  y: 606, tipo: 'teclaPergunta', componente: 'HD' },
            { x: 159,  y: 604, tipo: 'teclaBonus' },
            { x: 59,   y: 604, tipo: 'teclaNormal' },
            { x: 59,   y: 535, tipo: 'teclaNormal' },
            { x: 59,   y: 467, tipo: 'teclaNormal' },
            { x: 59,   y: 390, tipo: 'teclaNormal' },
            { x: 59,   y: 319, tipo: 'teclaPergunta', componente: 'Placa de Vídeo' },
            { x: 159,  y: 319, tipo: 'teclaBonus' },
            { x: 264,  y: 316, tipo: 'teclaNormal' },
            { x: 342,  y: 316, tipo: 'teclaNormal' },
            { x: 342,  y: 248, tipo: 'teclaNormal' },
            { x: 342,  y: 176, tipo: 'teclaNormal' },
            { x: 342,  y: 102, tipo: 'teclaNormal' },
            { x: 420,  y: 102, tipo: 'teclaNormal' },
            { x: 498,  y: 102, tipo: 'teclaPergunta', componente: 'Memória RAM' },
            { x: 577,  y: 102, tipo: 'teclaNormal' },
            { x: 685,  y: 103, tipo: 'teclaBonus' },
            { x: 705,  y: 176, tipo: 'teclaNormal' },
            { x: 705,  y: 248, tipo: 'teclaNormal' },
            { x: 705,  y: 320, tipo: 'teclaNormal' },
            { x: 785,  y: 321, tipo: 'teclaNormal' },
            { x: 864,  y: 322, tipo: 'teclaPergunta', componente: 'SSD' },
            { x: 864,  y: 388, tipo: 'teclaNormal' },
            { x: 864,  y: 461, tipo: 'teclaNormal' },
            { x: 864,  y: 533, tipo: 'teclaNormal' },
            { x: 785,  y: 533, tipo: 'teclaNormal' },
            { x: 680,  y: 533, tipo: 'teclaBonus' },
            { x: 577,  y: 533, tipo: 'teclaNormal' },
            { x: 473,  y: 534, tipo: 'teclaBonus' },
            { x: 444,  y: 604, tipo: 'teclaNormal' },
            { x: 444,  y: 675, tipo: 'teclaNormal' },
            { x: 444,  y: 746, tipo: 'teclaNormal' },
            { x: 524,  y: 746, tipo: 'teclaNormal' },
            { x: 603,  y: 746, tipo: 'teclaPergunta', componente: 'Placa-mãe' },
            { x: 705,  y: 746, tipo: 'teclaBonus' },
            { x: 809,  y: 746, tipo: 'teclaNormal' },
            { x: 888,  y: 746, tipo: 'teclaNormal' },
            { x: 967,  y: 746, tipo: 'teclaNormal' },
            { x: 1068, y: 747, tipo: 'teclaBonus' },
            { x: 1093, y: 675, tipo: 'teclaNormal' },
            { x: 1093, y: 604, tipo: 'teclaPergunta', componente: 'Cooler' },
            { x: 1093, y: 534, tipo: 'teclaNormal' },
            { x: 1093, y: 463, tipo: 'teclaNormal' },
            { x: 1093, y: 392, tipo: 'teclaNormal' },
            { x: 1094, y: 290, tipo: 'teclaBonusVertical' },
            { x: 1093, y: 189, tipo: 'teclaNormal' },
            { x: 1093, y: 118, tipo: 'teclaNormal' },
            { x: 1093, y: 47,  tipo: 'teclaNormal' },
            { x: 1197, y: 45,  tipo: 'teclaBonus' },
            { x: 1302, y: 47,  tipo: 'teclaNormal' },
            { x: 1378, y: 47,  tipo: 'teclaPergunta', componente: 'Processador' },
            { x: 1459, y: 47,  tipo: 'teclaNormal' },
            { x: 1459, y: 118, tipo: 'teclaNormal' },
            { x: 1459, y: 189, tipo: 'teclaNormal' },
            { x: 1459, y: 260, tipo: 'teclaNormal' },
            { x: 1354, y: 263, tipo: 'teclaBonus' },
            { x: 1249, y: 261, tipo: 'teclaNormal' },
            { x: 1249, y: 334, tipo: 'teclaNormal' },
            { x: 1249, y: 406, tipo: 'teclaNormal' },
            { x: 1249, y: 478, tipo: 'teclaNormal' },
            { x: 1353, y: 477, tipo: 'teclaBonus' },
            { x: 1459, y: 476, tipo: 'teclaNormal' },
            { x: 1538, y: 476, tipo: 'teclaPergunta', componente: 'Gabinete' },
            { x: 1538, y: 546, tipo: 'teclaNormal' },
            { x: 1538, y: 617, tipo: 'teclaNormal', fim: true }
        ];

        this.caminhoCasas.forEach((casa) => {
            this.add.image(casa.x, casa.y, casa.tipo).setScale(0.8);
        });

        this.posicaoAtual = 0;
        this.pixu = this.add.image(this.caminhoCasas[0].x, this.caminhoCasas[0].y, 'pixu').setScale(0.7).setDepth(20);

        this.btnDado = this.add.image(556, 409, 'imgDado')
            .setInteractive({ useHandCursor: true })
            .setScale(0.8); 

        this.btnDado.on('pointerover', () => {
            this.btnDado.setTint(0xf4f4f4);
            this.tweens.add({ targets: this.btnDado, scale: 0.88, duration: 120, ease: 'Back.easeOut' });
        });
        this.btnDado.on('pointerout', () => {
            this.btnDado.clearTint();
            this.tweens.add({ targets: this.btnDado, scale: 0.8, duration: 120, ease: 'Power2' });
        });
        this.btnDado.on('pointerdown', () => {
            this.btnDado.setScale(0.8);
            this.animarERolarDado();
        });
    }

    animarERolarDado() {
        this.btnDado.disableInteractive(); 
        this.btnDado.clearTint();

        this.tweens.add({
            targets: this.btnDado,
            angle: '+=720', 
            duration: 800, 
            ease: 'Cubic.easeOut', 
            onComplete: () => {
                let passosSorteados = Phaser.Math.Between(1, 6);
                
                let avisoPassos = this.add.text(this.btnDado.x, this.btnDado.y + 70, `+${passosSorteados}`, {
                    fontSize: '36px', fill: '#00ff00', fontStyle: 'bold', stroke: '#000000', strokeThickness: 5
                }).setOrigin(0.5).setDepth(30);

                this.tweens.add({
                    targets: avisoPassos,
                    y: avisoPassos.y - 50,
                    alpha: 0,
                    duration: 1000,
                    onComplete: () => {
                        avisoPassos.destroy();
                        this.avancarTabuleiro(passosSorteados); 
                    }
                });
            }
        });
    }

    atualizarTextoTempo() {
        let minutos = Math.floor(this.tempoSegundos / 60);
        let segundos = this.tempoSegundos % 60;
        let minFormatado = String(minutos).padStart(2, '0');
        let segFormatado = String(segundos).padStart(2, '0');

        if (this.textoTempo) {
            this.textoTempo.setText(`${minFormatado}:${segFormatado}`);
        }
    }

    avancarTabuleiro(passos) {
        this.btnDado.setAlpha(0.5); 
        this.moverPassoAPasso(passos); 
    }

    moverPassoAPasso(passosRestantes) {
        if (passosRestantes <= 0 || this.posicaoAtual >= this.caminhoCasas.length - 1) {
            let casaAtual = this.caminhoCasas[this.posicaoAtual];
            this.checarTipoCasa(casaAtual);
            return;
        }

        this.posicaoAtual++;
        let proximaCasa = this.caminhoCasas[this.posicaoAtual];

        this.tweens.add({
            targets: this.pixu,
            x: proximaCasa.x,
            y: proximaCasa.y,
            duration: 300,
            ease: 'Linear',
            onComplete: () => {
                if (proximaCasa.tipo === 'teclaPergunta' || proximaCasa.fim === true) {
                    this.checarTipoCasa(proximaCasa);
                } else {
                    this.moverPassoAPasso(passosRestantes - 1);
                }
            }
        });
    }

    checarTipoCasa(casa) {
        if (casa.tipo === 'teclaBonus' || casa.tipo === 'teclaBonusVertical') {
            this.mostrarTelaBonus(3);
            return;
        }

        if (casa.tipo === 'teclaPergunta') {
            this.mostrarTelaPergunta(casa.componente);
        } else if (casa.fim === true) {
            this.timerFase2.remove();
            this.mostrarTelaFinal();
        } else {
            this.btnDado.setAlpha(1).setInteractive(); 
        }
    }

    mostrarTelaBonus(casasBonus = 3) {
        let bonusContainer = this.add.container(0, 0).setDepth(1100);

        let fundoEscuro = this.add.rectangle(800, 450, 1600, 900, 0x000000, 0.7);
        fundoEscuro.setInteractive();

        let imagemBonus = this.add.image(800, 450, 'telaBonus');

        let posXNumero = imagemBonus.x + (imagemBonus.displayWidth * 0.17);
        let posYNumero = imagemBonus.y + (imagemBonus.displayHeight * 0.03);

        let textoBonus = this.add.text(posXNumero, posYNumero, `${casasBonus}`, {
            fontSize: '58px',
            fill: '#1e3a8a',
            fontFamily: 'sans-serif',
            fontStyle: 'bold'
        }).setOrigin(1.5);

        let posYBotao = imagemBonus.y + (imagemBonus.displayHeight * 0.385);
        let btnContinuar = this.add.image(800, posYBotao, 'btnContinuar')
            .setInteractive({ useHandCursor: true });

        btnContinuar.displayWidth = imagemBonus.displayWidth * 0.39;
        btnContinuar.scaleY = btnContinuar.scaleX;

        aplicarEfeitoBotao(this, btnContinuar, () => {
            bonusContainer.destroy();
            this.moverPassoAPasso(casasBonus);
        });

        bonusContainer.add([fundoEscuro, imagemBonus, textoBonus, btnContinuar]);
    }

    mostrarTelaPergunta(nomeComponente, perguntaAtual = null) {
        let listaPerguntas = this.bancoDePerguntas[nomeComponente];
        
        if (!listaPerguntas || listaPerguntas.length === 0) {
            alert(`Você caiu na casa de ${nomeComponente}! (Perguntas em desenvolvimento)`);
            this.btnDado.setAlpha(1).setInteractive();
            return; 
        }

        let dados = perguntaAtual;
        if (!dados) {
            let indiceSorteado = Phaser.Math.Between(0, listaPerguntas.length - 1);
            dados = listaPerguntas[indiceSorteado];
        }

        let painelContainer = this.add.container(0, 0).setDepth(1000);

        let fundoEscuro = this.add.rectangle(800, 450, 1600, 900, 0x000000, 0.6);
        fundoEscuro.setInteractive();

        let imagemCompleta = this.add.image(800, 450, dados.imagemTela);
        painelContainer.add([fundoEscuro, imagemCompleta]);

        criarCampoRespostaResponsivo(this, 'Digite aqui a resposta avançada...', (respostaJogador, limparCampo) => {
            let rLimpa = respostaJogador.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            let acertou = false;

            if (Array.isArray(dados.respostaCorreta)) {
                acertou = dados.respostaCorreta.some(opcao => {
                    let correta = opcao.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                    return rLimpa.includes(correta);
                });
            } else {
                let correta = dados.respostaCorreta.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                acertou = rLimpa.includes(correta);
            }

            limparCampo();
            painelContainer.destroy();

            this.mostrarTelaFeedback(acertou, nomeComponente, dados);
        });
    }

    mostrarTelaFeedback(acertou, nomeComponente, dados) {
        let feedbackContainer = this.add.container(0, 0).setDepth(1100);

        let fundoEscuro = this.add.rectangle(800, 450, 1600, 900, 0x000000, 0.7);
        fundoEscuro.setInteractive();

        let chaveImagem = acertou ? 'telaRespostaCerta' : 'telaRespostaErrada';
        let imagemFeedback = this.add.image(800, 450, chaveImagem);

        let posYBotao = imagemFeedback.y + (imagemFeedback.displayHeight * 0.385);
        let btnContinuar = this.add.image(800, posYBotao, 'btnContinuar')
            .setInteractive({ useHandCursor: true });

        btnContinuar.displayWidth = imagemFeedback.displayWidth * 0.39;
        btnContinuar.scaleY = btnContinuar.scaleX;

        aplicarEfeitoBotao(this, btnContinuar, () => {
            feedbackContainer.destroy();
            if (acertou) {
                this.btnDado.setAlpha(1).setInteractive();
            } else {
                this.mostrarTelaPergunta(nomeComponente, dados);
            }
        });

        feedbackContainer.add([fundoEscuro, imagemFeedback, btnContinuar]);
    }

    mostrarTelaFinal() {
        let finalContainer = this.add.container(0, 0).setDepth(1200);

        let imagemFinal = this.add.image(800, 450, 'telaFinal').setDisplaySize(1600, 900);

        let textoTempoFinal = this.add.text(832, 535, this.textoTempo.text, {
            fontSize: '42px',
            fill: '#ffffff',
            fontFamily: 'sans-serif',
            fontStyle: 'bold',
            stroke: '#1e3a8a',
            strokeThickness: 6
        }).setOrigin(0.5);

        let btnVoltarMenu = this.add.image(288, 803, 'btnVoltarMenu')
            .setInteractive({ useHandCursor: true });
        btnVoltarMenu.displayWidth = 370;
        btnVoltarMenu.scaleY = btnVoltarMenu.scaleX;

        aplicarEfeitoBotao(this, btnVoltarMenu, () => {
            finalContainer.destroy();
            this.scene.start('MenuInicial');
        });

        let btnRecomecar = this.add.image(800, 803, 'btnRecomecar')
            .setInteractive({ useHandCursor: true });
        btnRecomecar.displayWidth = 370;
        btnRecomecar.scaleY = btnRecomecar.scaleX;

        aplicarEfeitoBotao(this, btnRecomecar, () => {
            finalContainer.destroy();
            this.scene.start('Fase1', { tempoSegundos: 0 });
        });

        let btnSair = this.add.image(1312, 803, 'btnSair')
            .setInteractive({ useHandCursor: true });
        btnSair.displayWidth = 370;
        btnSair.scaleY = btnSair.scaleX;

        aplicarEfeitoBotao(this, btnSair, () => {
            sairJogo();
        });

        finalContainer.add([imagemFinal, textoTempoFinal, btnVoltarMenu, btnRecomecar, btnSair]);
    }
}


// ==========================================
// CAMPO DE RESPOSTA INTEGRADO À ESCALA DO JOGO
// ==========================================
function criarCampoRespostaResponsivo(cena, placeholderTexto, aoEnviarResposta) {
    const posX = 1060;
    const posY = 770;
    const largura = 360;
    const altura = 44;

    const inputHtml = document.createElement('input');
    inputHtml.type = 'text';
    inputHtml.placeholder = placeholderTexto;
    inputHtml.style.width = `${largura}px`;
    inputHtml.style.height = `${altura}px`;
    inputHtml.style.fontSize = '18px';
    inputHtml.style.padding = '4px 12px';
    inputHtml.style.boxSizing = 'border-box';
    inputHtml.style.fontFamily = 'sans-serif';
    inputHtml.style.border = '2px solid #2563eb';
    inputHtml.style.borderRadius = '8px';
    inputHtml.style.outline = 'none';
    inputHtml.style.backgroundColor = '#ffffff';
    inputHtml.style.color = '#111827';
    inputHtml.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.35)';
    inputHtml.style.pointerEvents = 'auto';
    inputHtml.style.userSelect = 'text';
    inputHtml.style.cursor = 'text';

    const domElement = cena.add.dom(posX, posY, inputHtml).setDepth(2000);

    const limparCampo = () => {
        if (domElement && domElement.scene) {
            domElement.destroy();
        } else if (inputHtml.parentNode) {
            inputHtml.remove();
        }
    };

    cena.events.once('shutdown', limparCampo);

    ['pointerdown', 'mousedown', 'mouseup', 'click'].forEach(evento => {
        inputHtml.addEventListener(evento, (e) => {
            e.stopPropagation();
        });
    });

    setTimeout(() => {
        inputHtml.focus();
    }, 50);

    inputHtml.addEventListener('keydown', (e) => {
        e.stopPropagation();

        if (e.key === 'Enter') {
            e.preventDefault();
            const respostaJogador = inputHtml.value;

            if (!respostaJogador || respostaJogador.trim() === '') {
                alert('Por favor, digite uma resposta!');
                setTimeout(() => inputHtml.focus(), 50);
                return;
            }

            aoEnviarResposta(respostaJogador, limparCampo);
        }
    });
}


// ==========================================
// INICIALIZAÇÃO AUTOMÁTICA DO JOGO NO MENU
// ==========================================
let game;

function esconderMenuAntigoHtml() {
    const botoes = document.querySelector('.botoes-container');
    const titulo = document.querySelector('.titulo-imagem');
    const menu = document.querySelector('.menu-container');

    if (botoes) botoes.style.display = 'none';
    if (titulo) titulo.style.display = 'none';
    if (menu) menu.style.backgroundImage = 'none';
}

function criarInstanciaJogo() {
    esconderMenuAntigoHtml();
    if (!game) {
        const config = {
            type: Phaser.AUTO,
            width: 1600,
            height: 900,
            parent: 'game-container',
            dom: {
                createContainer: true
            },
            scale: {
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH
            },
            scene: [
                MenuInicial,
                TelaInicialFase1,
                Tutorial,
                ApoioPedagogico,
                ResumoPleno,
                MaterialProfessor,
                MaterialEstudante,
                ComponentesFuncoes,
                Revisao,
                SobreOProjeto,
                Creditos,
                Fase1,
                Fase2
            ]
        };
        game = new Phaser.Game(config);
    }
}

function sairJogo() {
    if (confirm("Tem a certeza de que deseja sair do jogo?")) {
        window.close();
        const container = document.getElementById('app-container') || document.body;
        container.innerHTML = "<h1 style='color: white; font-family: sans-serif; text-align: center; padding-top: 20%;'>Obrigado por jogar! Pode fechar esta janela.</h1>";
    }
}

window.addEventListener('DOMContentLoaded', () => {
    criarInstanciaJogo();
});