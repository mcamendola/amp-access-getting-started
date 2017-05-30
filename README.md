# amp-access-getting-started

O propósito desse projeto é apresentar um exemplo básico de utilização do componente AMP Access (https://ampbyexample.com/components/amp-access/), que adiciona suport para paywall e assinaturas em templates AMP. 

## Conhecimentos exigidos

Para um melhor entendimento sobre o uso do amp-access, aplicado nesse projeto, é necessário um conhecimento em:

* AMP (https://github.com/mcamendola/amp-techtalk)
* node.js (https://nodejs.org/en/)

## Instalando

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