# amp-access-getting-started

O propósito desse projeto é apresentar um exemplo básico de utilização do componente AMP Access (https://www.ampproject.org/docs/reference/components/amp-access), que adiciona suporte para paywall e assinaturas em templates AMP. 

## Conhecimentos exigidos

Para um melhor entendimento sobre o uso do amp-access, aplicado nesse projeto, é necessário um conhecimento em:

* AMP (https://github.com/mcamendola/amp-techtalk)
* node.js (https://nodejs.org/en/)

## Executando o projeto

Abra o terminal do Linux ou o GitBash no Windows e certifique-se que o `nodejs` está instalando corretamente:
```
$ npm -v
$ node -v
```

Faça clone do repositório através do comando:
```
$ git clone git@github.com:mcamendola/amp-access-getting-started.git
```

Instale [node.js](https://nodejs.org/) e execute os seguintes comandos no diretório do projeto:
```
$ npm install
$ npm start
```

Caso o comando `npm start` falhe, execute os comandos abaixo pois a conexão pode ter falhado devido ao proxy:
```
$ npm config set proxy "http://[USUARIO]:[SENHA]@[URL DO PROXY]:[PORTA DO PROXY]"
$ npm set strict-ssl=false
$ npm start
```

Teste através do link:
```
http://localhost:3000/
```

### nodemon (https://github.com/remy/nodemon)

Caso queira visualizar as alterações no código do app sem a necessidade de restart do server, você pode utilizar o modulo conhecido como *nodemon*. Basicamente esse módulo monitora qualquer alteração no código e atualiza o server automaticamente.
Para utilizá-lo, é necessário instalar o módulo na máquina através do seguinte comando:

```bash
$ sudo npm install -g nodemon
```

Após a instalação do nodemon, para executar o server, ao invés de utilizar o comando ```npm start``` utilize o seguinte comando:

```bash
$ nodemon app.js
```

## Entendendo o código

Basicamente foi construída uma aplicação em node.js com o propósito de exemplificar a utilização do componente amp-access que adiciona o suporte à paywalls e assinaturas em templates AMP.
A integração implementada nesse projeto inclui 2 passos principais:

1. Implementação dos endpoints do AMP Access: é através desses endpoints que o AMP Access se integra às regras de exibição do Paywall do publicador.
2. Configuração do AMP Access no template AMP: onde será realizada a configuração dos endpoints do AMP Access, bem como, as regras de acesso ao conteúdo.

### Implementação dos endpoints do AMP Access

É nessa etapa que diremos ao AMP Access quais as urls (endpoints) dos serviços que possuem a lógica de controle de acesso e liberação de degustação de matérias para o usuário. Essa configuração deve ser realizada em cada um dos templates AMP usando as configurações que serão aboradadas no tópico seguinte ([Configuração do AMP Access no template AMP](# Configuração do AMP Access no template AMP)).

**IMPORTANTE** Todos os endpoints acessados pelo AMP Access precisam implementar as políticas de segurança descritas no documento ([AMP CORS Security Spec](https://www.ampproject.org/docs/reference/components/amp-access#cors-origin-security)). Nesse projeto de teste garantimos essas regras de segurança através do middleware ([app/middlewares/amp-access-cors.js](app/middlewares/amp-access-cors.js)).

* **authorization** ([app/api/amp-access/authorization.js](app/api/amp-access/authorization.js)): endpoint responsável pelas regras de autorização do usuário ao acesso do conteúdo. A *response* desse endpoint deve ser um JSON com formato aberto, ou seja, fica a critério do publisher definir a estrutura do objeto que será devolvido. É importante ressaltar que os atributos contidos nesse objeto de resposta que serão utilizados nas regras de exibição do conteúdo dentro do template AMP.
* **pingback** ([app/api/amp-access/pingback.js](app/api/amp-access/pingback.js)): O endpoint pingback é chamado pelo amp-access ao término da renderização do template AMP. Esse endpoint é consumido através do protocolo HTTP/HTTPS utilizando method POST. Ele pode ser usado para contabilizar a leitura da matéria para o usuário (READER_ID) em questão.
* **login** ([/login](app/controllers/login-controller.js)): Basicamente é uma página html que será aberta, contendo o formulário através do qual o usuário poderá se autenticar. 

### Configuração do AMP Access no template AMP

O segundo passo para utilização do componente amp-access é configurar os templates AMP para utilizar esse componente, além é claro, de inserir no mesmo as regras de exibição do conteúdo.
As configurações a seguir se encontram nos arquivos do diretório *app/views/materias*. Esses arquivos são representações de templates AMP para matérias fictícias.

1. Configurando os endpoints do AMP Access ([1.ejs](app/views/materias/1.ejs#224)).

    ```html
    <script id="amp-access" type="application/json">
    {
      "authorization": "<% host %>/api/amp-access/authorization.json?rid=READER_ID&url=CANONICAL_URL&ref=DOCUMENT_REFERRER&_=RANDOM",
      "pingback": "<% host %>/api/amp-access/pingback?rid=READER_ID&url=CANONICAL_URL&ref=DOCUMENT_REFERRER",
      "login": {
        "sign-in": "<% host %>/login?rid=READER_ID&url=CANONICAL_URL",
        "sign-out": "<% host %>/logout?rid=READER_ID"
      },
      "authorizationFallbackResponse": {
        "error": true,
        "autorizado": true
      }     
    }
    </script>
    ```

A variável *host* utilizada como prefixo para os endpoints se trata de uma variável criada no server contendo o protocolo e domínio utilizado no acesso ao template. Por exemplo, executando o projeto em ambiente local (DEV) o valor de *host* seria *http://localhost:3000*

2. Carregando as libraries necessárias para funcionamento do componente AMP Access ([1.ejs](app/views/materias/1.ejs#238)):

    ```html
    <script async custom-element="amp-access" src="https://cdn.ampproject.org/v0/amp-access-0.1.js"></script>
    <script async custom-template="amp-mustache" src="https://cdn.ampproject.org/v0/amp-mustache-0.1.js"></script>
    <script custom-element="amp-analytics" src="https://cdn.ampproject.org/v0/amp-analytics-0.1.js" async></script>
    ```

O carregamento do componente *amp-mustache* é opcional, mas, ele facilita a exibição de valores recebidos como resposta do endpoint *authorization* na interface final com o usuário. Um exemplo de sua utilização em nosso exemplo pode ser encontrada no arquivo ([1.ejs](app/views/materias/1.ejs#260)).

3. Já no template AMP, uma vez que o componente amp-access já está carregado e configurado, podemos definir quais parts estarão visiveis ao usuário quando o mesmo for assinante ou estiver apenas degustando ([1.ejs](app/views/materias/1.ejs#258)):

    ```html
    <section amp-access="NOT autorizado AND maxViews" amp-access-hide>
        <div class="paywall-message">
            <template amp-access-template type="amp-mustache">
                Você atingiu o limite de {{maxViews}} matérias gratuitas esse mês.
            </template>
        </div>
        <div on="tap:amp-access.login-sign-in" class="button" role="button" tabindex="0">
            <a>Já sou assinante? <span>Clique aqui para se autenticar</span></a>
        </div>
    </section>
    ```

Vamos realizar um zoom no código acima e destacar o seguinte trecho:

```html
<section amp-access="NOT autorizado AND maxViews" amp-access-hide>
```
O valor do atributo *amp-access* contêm a regra que será interpretada pelo AMP runtime para definir se o HTML contido na tag `<section>` será exibido para o usuário ou não.

Na condição definida dentro desse atributo temos os valores *autorizado* e *maxViews* que são atributos contidos no JSON de resposta do endpoint *authorization*.

Em resumo, quando o AMP Runtime realiza a procedimento de interpretação do template e encontra o atributo *amp-acess*, realiza uma chamada para o endpoint *authorization* que devolve, por exemplo, a seguinte resposta:

```JSON
{
    "autorizado": false,
    "maxViews": 3
}
```
Uma vez obtida a resposta já é possível avaliar a condição `NOT autorizado AND maxViews`. Com base na resposta obtida podemos definir que a condição é **verdadeira**, logo, o usuário visualizará o conteúdo dentro da tag `<section>`:

```html
Você atingiu o limite de 3 matérias gratuitas esse mês.

Já sou assinante? Clique aqui para se autenticar
```

## Sugestões

slack:
#tribe_performance
@muriloamendola

email: <mcoliveira@edglobo.com.br>


