#Update readme 

![Index app](./doc/assets/CRUD_Amazon_DynamoDB_AWS.drawio.png)

# CRUD_Amazon_DynamoDB_AWS
Modelo CRUD para el manejo de objetos payments de mercadopago con DynamoDB de aws implementado con Api-Gateway, Systems Manager Parameter Store, Serverless-Framework, Lambda, Typescript, DynamoDB, aws-sdk-v3, entre otros.
Como representación se tomara la api de mercado pago para el manejo de pagos.

* [Api doc MP pagos](https://www.mercadopago.com.ar/developers/es/reference/payments/_payments/post)
* [Playlist prueba de funcionalidad](https://www.youtube.com/playlist?list=PLCl11UFjHurBIy51oB_CZa46KSF1cWn9W)

<br>

## Índice 📜

<details>
 <summary> Ver </summary>
 
 <br>
 
### Sección 1)  Descripción, configuración y tecnologías

 - [1.0) Descripción del Proyecto.](#10-descripción-)
 - [1.1) Ejecución del Proyecto.](#11-ejecución-del-proyecto-)
 - [1.2) Configuración del proyecto desde cero](#12-configuración-del-proyecto-desde-cero-)
 - [1.3) Tecnologías.](#13-tecnologías-)


### Sección 2) Endpoints y Ejemplos 
 
 - [2.0) EndPoints y recursos.](#20-endpoints-y-recursos-)

### Sección 3) Prueba de funcionalidad y Referencias
 
 - [3.0) Prueba de funcionalidad.](#30-prueba-de-funcionalidad-)
 - [3.1) Referencias.](#31-referencias-)


<br>

</details>



<br>

## Sección 1)  Descripción, configuración y tecnologías


### 1.0) Descripción [🔝](#índice-) 

<details>
  <summary>Ver</summary>
 <br>

### 1.0.0) Descripción General

Aplicación CRUD para operaciones de [objetos payments de MercadoPago](https://www.mercadopago.com.ar/developers/es/reference/payments/_payments/post) a través de una arquitectura serverless con Typescript y una db de tipo dynamodb, las operaciones incluyen la creación de un pago, obtener todos los pagos creados con y sin filtros, editar y eliminar un pago.
`Importante`: Hay alertas de seguridad de dependabot que apuntan contra el plugin "serverless-dynamodb-local". No aplicar parches de seguridad a dicho plugin, ya que la versión `^1.0.2` tiene problemas al momento de la creación de tablas y ejecución del servicio de dynamo. Se recomienda mantener la última versión estable `^0.2.40` con las alertas de seguridad generadas.


 
### 1.0.1) Descripción Arquitectura y Funcionamiento

La imagen de la arquitectura de aws empleada describe el flujo de funcionamiento de la app de forma general. Cualquier petición hacia la misma, parte desde un cliente (Ej: Postman, servidor, etc).
La descripción y flujo de cada paso es la siguiente : 
 * `Paso 0` : Se genera una solicitud-petición hacia una de las funcionalidades desarrollada, la misma es recibida a través del api-gateway y solamente se validará si es que dentro de los encabezados de dicha solicitud se encuentra la x-api-key correcta.
 * `Pasos 1A, 1B, etc` : Todos estos pasos corresponden a un endpoint con su recurso especifico. Por ej. para create payment (1A) es http://localhost:4000/dev/v1/payments....etc. Revisar dichos endpoints en sección endpoints. Cada lambda realiza comprobación de x-api-key y token.
 * `Pasos 2` : Las lambdas realizan las validaciones de las ssm correspondientes con el System Manager Paramater Store.. validan token, valores de conexión con la db etc.
* `Pasos 3` : Las lambdas realizan las transacciones y operaciones descritas con el tipo de base de datos Dynamodb.

<br>

</details>


### 1.1) Ejecución del Proyecto [🔝](#índice-)

<details>
  <summary>Ver</summary>
  <br>
 
* Creamos un entorno de trabajo a través de algún ide, podemos o no crear una carpeta raíz para el proyecto, nos posicionamos sobre la misma
```git
cd 'projectRootName'
```
* Una vez creado un entorno de trabajo a través de algún ide, clonamos el proyecto
```git
git clone https://github.com/andresWeitzel/CRUD_Amazon_DynamoDB_AWS
```
* Instalamos la última versión LTS de [Nodejs(v18)](https://nodejs.org/en/download)
* Instalamos Serverless Framework de forma global si es que aún no lo hemos realizado
```git
npm install -g serverless
```
* Verificamos la versión de Serverless instalada
```git
sls -v
```
* Instalamos todos los paquetes necesarios
```git
npm i
```
`Importante`: Hay alertas de seguridad de dependabot que apuntan contra el plugin "serverless-dynamodb-local". No aplicar parches de seguridad a dicho plugin, ya que la versión `^1.0.2` tiene problemas al momento de la creación de tablas y ejecución del servicio de dynamo. Se recomienda mantener la última versión estable `^0.2.40` con las alertas de seguridad generadas.
* Las variables ssm utilizadas en el proyecto se mantienen para simplificar el proceso de configuración del mismo. Es recomendado agregar el archivo correspondiente (serverless_ssm.yml) al .gitignore.
* El siguiente script configurado en el package.json del proyecto es el encargado de
   * Levantar serverless-offline (serverless-offline)
 ```git
  "scripts": {
    "serverless-offline": "sls offline start",
    "start": "npm run serverless-offline"
  },
```
* Ejecutamos la app desde terminal.
```git
npm start
```
* Si se presenta algún mensaje indicando qué el puerto 4000 u 8000 ya está en uso, podemos terminar todos los procesos dependientes y volver a ejecutar la app
```git
npx kill-port 4000 (serverless)
npx kill-port 8000 (dynamo)
npm start
```
 
<br>

</details>


### 1.2) Configuración del proyecto desde cero [🔝](#índice-)

<details>
  <summary>Ver</summary>
 <br>
 
  
* Creamos un entorno de trabajo a través de algún ide, luego de crear una carpeta nos posicionamos sobre la misma
```git
cd 'projectName'
```
* Instalamos la última versión LTS de [Nodejs(v18)](https://nodejs.org/en/download)
* Instalamos Serverless Framework de forma global si es que aún no lo tenemos instalado.
```git
npm install -g serverless
```
* Verificamos la versión de Serverless instalada
```git
sls -v
```
* Inicializamos un template ts de serverles
```git
serverless create --template aws-nodejs-typescript
```
* Comprobamos la versión de typescript
```git
tsc -v
```
* Instalamos los paquetes necesarios
```git
npm i
```
* Instalamos serverless offline 
```git
npm i serverless-offline --save-dev
```
* Agregamos el plugin dentro del serverless.yml
```yml
plugins:
  - serverless-offlline
``` 
* Instalamos serverless ssm 
```git
npm i serverless-offline-ssm --save-dev
```
* Agregamos el plugin dentro del serverless.yml
```yml
plugins:
  - serverless-offlline-ssm
```
* Instalamos esbuild para el compilado entre js y ts
```git
npm i serverless-esbuild
```  
* Instalamos el plugin para el uso de dynamodb en local (No el servicio de dynamoDB, este viene configurado en los archivos dentro de .dynamodb).
`Importante`: Hay alertas de seguridad de dependabot que apuntan contra el plugin "serverless-dynamodb-local". No aplicar parches de seguridad a dicho plugin, ya que la versión `^1.0.2` tiene problemas al momento de la creación de tablas y ejecución del servicio de dynamo. Se recomienda mantener la última versión estable `^0.2.40` con las alertas de seguridad generadas.
```git
npm install serverless-dynamodb-local --save-dev
```
 * Agregamos el plugin dentro del serverless.yml
```yml
plugins:
  - serverless-dynamodb-local
```
* Instalamos el sdk client de dynamodb para las operaciones de db necesarias
``` git
npm install @aws-sdk/client-dynamodb
```     
* Instalamos el sdk lib de dynamodb para las operaciones de db necesarias
``` git
npm i @aws-sdk/lib-dynamodb
```
* Modificaremos la plantilla inicial. Cambiamos `serverless.ts` por `serverless.yml` para las configs estandarizadas.
* Reemplazamos la plantila serverless.ts inicial por la siguiente como modelo (cambiar nombre, etc) según la creada...
```yml

service: nombre

frameworkVersion: '3'

provider:
  name: aws
  runtime: nodejs12.x
  stage: dev
  region : us-west-1
  memorySize: 512
  timeout : 10

plugins:
    - serverless-dynamodb-local
    - serverless-esbuild
    - serverless-offline-ssm
    - serverless-offline  

functions:
  functions:
    hello:
      handler: src/functions/hello/handler.ts
      events:
        - http:
            path: /test
            method: POST
            private: true  

custom:
  serverless-offline:
    httpPort: 4000
    lambdaPort: 4002    
  serverless-offline-ssm:
    stages:
      - dev
  dynamodb:
    stages:
      - dev
```
* Debemos descargar el .jar junto con su config para ejecutar el servicio de dynamodb. [Descargar aquí](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.DownloadingAndRunning.html#DynamoDBLocal.DownloadingAndRunning.title)
* Una vez descargado el .jar en formato .tar descomprimimos y copiamos todo su contenido dentro de la carpeta `.dynamodb`.
* Usaremos [git](https://www.hostinger.com.ar/tutoriales/instalar-git-en-distintos-sistemas-operativos) como control de versiones. Nos posicionamos en la app e inicializamos git
```git
git init
```
* Creamos el repositorio en github (sin readme) y agregamos la url del repositorio creado (ej: la siguiente)
```git
git remote add origin https://github.com/andresWeitzel/CRUD_Amazon_DynamoDB_AWS
```
* Traemos los cambios del remoto, agregamos los nuevos cambios en local, commitiamos y los subimos al repo.
```git
git pull origin master
git add *
git commit -m "Add app config"
git push origin master
```
* Las variables ssm utilizadas en el proyecto se mantienen para simplificar el proceso de configuración del mismo. Es recomendado agregar el archivo correspondiente (serverless_ssm.yml) al .gitignore.
* El siguiente script configurado en el package.json del proyecto es el encargado de
   * Levantar serverless-offline (serverless-offline)
 ```git
  "scripts": {
    "serverless-offline": "sls offline start",
    "start": "npm run serverless-offline"
  },
```
* Ejecutamos la app desde terminal.
```git
npm start
```
* Si se presenta algún mensaje indicando qué el puerto 4000 u 8000 ya está en uso, podemos terminar todos los procesos dependientes y volver a ejecutar la app
```git
npx kill-port 4000 (serverless)
npx kill-port 8000 (dynamo)
npm start
```
* Deberíamos esperar un output por consola con los siguiente servicios levantados cuando se ejecuta el comando anterior
```git
> crud-amazon-dynamodb-aws@1.0.0 start
> npm run serverless-offline

> crud-amazon-dynamodb-aws@1.0.0 serverless-offline
> sls offline start

serverless-offline-ssm checking serverless version 3.31.0.
Dynamodb Local Started, Visit: http://localhost:8000/shell
DynamoDB - created table payments-table

etc.....
```
* Ya tenemos una app funcional con una estructura inicial definida por Serverless-Framework. La aplicación queda deployada en http://localhost:4002 y podemos testear el endpoint declarado en el serverless desde postman
* `Aclaración` : El resto de las modificaciones aplicadas sobre la plantilla inicial no se describen por temas de simplificación de doc. Para más info consultar el tutorial de [Serverless-framework](https://www.serverless.com/) para el uso de servicios, plugins, etc.

<br>

</details>


### 1.3) Tecnologías [🔝](#índice-)

<details>
  <summary>Ver</summary>
 <br>

| **Tecnologías** | **Versión** | **Finalidad** |               
| ------------- | ------------- | ------------- |
| [SDK](https://www.serverless.com/framework/docs/guides/sdk/) | 4.3.2  | Inyección Automática de Módulos para Lambdas |
| [Serverless Framework Core v3](https://www.serverless.com//blog/serverless-framework-v3-is-live) | 3.23.0 | Core Servicios AWS |
| [Systems Manager Parameter Store (SSM)](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html) | 3.0 | Manejo de Variables de Entorno |
| [Amazon Api Gateway](https://docs.aws.amazon.com/apigateway/latest/developerguide/welcome.html) | 2.0 | Gestor, Autenticación, Control y Procesamiento de la Api | 
| [Amazon DynamoDB](https://docs.aws.amazon.com/es_es/amazondynamodb/latest/developerguide/Introduction.html) | 2019.11.21 | Servicio de base de datos NoSQL |
| [Typescript](https://www.typescriptlang.org/) | 5.2 | Lenguaje altamente tipado |
| [NodeJS](https://nodejs.org/en/) | 14.18.1  | Librería JS |
| [VSC](https://code.visualstudio.com/docs) | 1.72.2  | IDE |
| [Postman](https://www.postman.com/downloads/) | 10.11  | Cliente Http |
| [CMD](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/cmd) | 10 | Símbolo del Sistema para linea de comandos | 
| [Git](https://git-scm.com/downloads) | 2.29.1  | Control de Versiones |

</br>


| **Serverless Plugin** | **Descripción** |               
| -------------  | ------------- |
| [serverless-esbuild](https://www.serverless.com/plugins/serverless-esbuild) | Complemento para transpilar código Typescript y Javascript |
| [serverless-offline](https://www.npmjs.com/package/serverless-offline) | Este complemento sin servidor emula AWS λ y API Gateway en entorno local |
| [serverless-offline-ssm](https://www.npmjs.com/package/serverless-offline-ssm) | Complemento para variables de entorno que cumplen los parámetros de SSM en el momento de la compilación y las sustituye desde un archivo  |
| [serverless-dynamodb-local](https://www.serverless.com/plugins/serverless-dynamodb-local) | Complemento para tipo de db NoSQL DynamoDB |


<br>

</details>


<br>


## Sección 2) Endpoints y Ejemplos. 


### 2.0) Endpoints y recursos [🔝](#índice-) 


<details>
  <summary>Ver</summary>

### Operaciones de tipo GET:
* http://localhost:4000/dev/v1/payments/list
* http://localhost:4000/dev/v1/payments/list-with-filters
* http://localhost:4000/dev/v1/payments/uuid/{uuid}
* `Todos los endpoints son paginados opcionales menos el /uuid/{uuid}`

### Operaciones de tipo POST:
* http://localhost:4000/dev/v1/payments

### Operaciones de tipo PUT:
* http://localhost:4000/dev/v1/payments/{uuid}

### Operaciones de tipo DELETE:
* http://localhost:4000/dev/v1/payments/{uuid}

### Aclaraciones
* {valor-requerido}
* Paginado por defecto : ?page=0&limit=5
* Paginado opcional : ?page={nro}&limit={nro}


<br>

</details>


### 2.1) Ejemplos [🔝](#índice-) 

<details>
  <summary>Ver</summary>
<br>


### 2.1.0) Variables en Postman

| **Variable** | **Initial value** | **Current value** |               
| ------------- | ------------- | ------------- |
| base_url | http://localhost:4000/dev/v1 | http://localhost:4000/dev/v1 |
| x-api-key | f98d8cd98h73s204e3456998ecl9427j  | f98d8cd98h73s204e3456998ecl9427j |
| bearer_token | Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c  | Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c |

<br>

<br>

### 2.1.1) Crear un objeto payment

#### Request (POST) | Code snippet
``` postman
curl --location 'http://localhost:4000/dev/v1/payments/' \
--header 'x-api-key: f98d8cd98h73s204e3456998ecl9427j' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' \
--header 'Content-Type: application/json' \
--data-raw '{
  "items": {
    "id": "MLB2907679857",
    "title": "Point Mini",
    "description": "Producto Point para cobros con tarjetas mediante bluetooth",
    "picture_url": "https://http2.mlstatic.com/resources/frontend/statics/growth-sellers-landings/device-mlb-point-i_medium@2x.png",
    "category_id": "electronics",
    "quantity": 1,
    "unit_price": 1000
  },
  "payer": {
    "id": "12",
    "first_name": "Test",
    "last_name": "Test"
  },
  "shipments": {
    "receiver_address": {
      "zip_code": "B16-2231FG",
      "state_name": "Rio de Janeiro",
      "city_name": "Buzios",
      "street_name": "Av das Nacoes Unidas",
      "street_number": 3003
    }
  },
  "description": "Payment for product",
  "external_reference": "MP0001",
  "payment_method_id": "visa",
  "token": "ff8080814c11e237014c1ff593b57b4d",
  "transaction_amount": 58.8
}'
```

#### Response (200 OK)
``` postman
{
    "message": {
        "uuid": "d5d58c31-8c29-41d2-a2e0-88322cb0238d",
        "description": "Payment for product",
        "externalReference": "MP0001",
        "paymentMethodId": "visa",
        "token": "ff8080814c11e237014c1ff593b57b4d",
        "transactionAmount": 58.8,
        "items": {
            "id": "MLB2907679857",
            "title": "Point Mini",
            "description": "Producto Point para cobros con tarjetas mediante bluetooth",
            "picture_url": "https://http2.mlstatic.com/resources/frontend/statics/growth-sellers-landings/device-mlb-point-i_medium@2x.png",
            "category_id": "electronics",
            "quantity": 1,
            "unit_price": 1000
        },
        "payer": {
            "id": "12",
            "first_name": "Test",
            "last_name": "Test"
        },
        "shipments": {
            "receiver_address": {
                "street_number": 3003,
                "city_name": "Rio de Janeiro",
                "state_name": "Buzios",
                "zip_code": "B16-2231FG",
                "street_name": "Buzios"
            }
        }
    }
}
```

#### Response (400 Bad Request) --> Aplica a todos los atributos con validación
``` postman
{
    "message": "Bad request, check request attributes for Item Object . Validate the following : The value of the item id must be between 1 and 25 characters,The id of item must be of type string,The id of item cannot be empty"
}
```

#### Response (400 Bad Request)
``` postman
{
    "message": "Bad request, check missing or malformed headers"
}
```


#### Response (401 Unauthorized)
``` postman
{
    "message": "Not authenticated, check x_api_key and Authorization"
}
```

#### Other responses


<br>

<br>

### 2.1.2) Obtener todos los objetos Payment según filtro aplicado (descripción)
#### Request (GET) | Code snippet
``` postman
curl --location 'http://localhost:4000/dev/v1/payments/list-with-filters?filter=description&filterValue=Payment&limit=10&orderAt=asc' \
--header 'x-api-key: f98d8cd98h73s204e3456998ecl9427j' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' \
--header 'Content-Type: application/json' \
--data ''
```

#### Response (200 OK)
``` postman
{
    "message": [
        {
            "externalReference": "MP0001",
            "paymentMethodId": "visa",
            "transactionAmount": 58.8,
            "description": "Payment for product",
            "uuid": "d5d58c31-8c29-41d2-a2e0-88322cb0238d",
            "items": {
                "quantity": 1,
                "picture_url": "https://http2.mlstatic.com/resources/frontend/statics/growth-sellers-landings/device-mlb-point-i_medium@2x.png",
                "category_id": "electronics",
                "description": "Producto Point para cobros con tarjetas mediante bluetooth",
                "id": "MLB2907679857",
                "title": "Point Mini",
                "unit_price": 1000
            },
            "payer": {
                "first_name": "Test",
                "last_name": "Test",
                "id": "12"
            },
            "shipments": {
                "receiver_address": {
                    "street_number": 3003,
                    "city_name": "Rio de Janeiro",
                    "state_name": "Buzios",
                    "zip_code": "B16-2231FG",
                    "street_name": "Buzios"
                }
            },
            "token": "ff8080814c11e237014c1ff593b57b4d"
        }
        ETC....
    ]
}
```


#### Response (400 Bad Request)
``` postman
{
    "message": "Bad request, check missing or malformed headers"
}
```


#### Response (401 Unauthorized)
``` postman
{
    "message": "Not authenticated, check x_api_key and Authorization"
}
```

#### Other responses


<br>

<br>

### 2.1.3) Obtener un objeto payment según su uuid

#### Request (GET) | Code snippet
``` postman
curl --location 'http://localhost:4000/dev/v1/payments/uuid/d5d58c31-8c29-41d2-a2e0-88322cb0238d' \
--header 'x-api-key: f98d8cd98h73s204e3456998ecl9427j' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' \
--header 'Content-Type: application/json' \
--data ''
```

#### Response (200 OK)
``` postman
{
    "message": {
        "externalReference": "MP0001",
        "paymentMethodId": "visa",
        "transactionAmount": 58.8,
        "description": "Payment for product",
        "uuid": "d5d58c31-8c29-41d2-a2e0-88322cb0238d",
        "items": {
            "quantity": 1,
            "picture_url": "https://http2.mlstatic.com/resources/frontend/statics/growth-sellers-landings/device-mlb-point-i_medium@2x.png",
            "category_id": "electronics",
            "description": "Producto Point para cobros con tarjetas mediante bluetooth",
            "id": "MLB2907679857",
            "title": "Point Mini",
            "unit_price": 1000
        },
        "payer": {
            "first_name": "Test",
            "last_name": "Test",
            "id": "12"
        },
        "shipments": {
            "receiver_address": {
                "street_number": 3003,
                "city_name": "Rio de Janeiro",
                "state_name": "Buzios",
                "zip_code": "B16-2231FG",
                "street_name": "Buzios"
            }
        },
        "token": "ff8080814c11e237014c1ff593b57b4d"
    }
}
```


#### Response (400 Bad Request)
``` postman
{
    "message": "Bad request, check missing or malformed headers"
}
```


#### Response (401 Unauthorized)
``` postman
{
    "message": "Not authenticated, check x_api_key and Authorization"
}
```

#### Response (500 Internal Server Error)
``` postman
{
    "message": "Bad request, unable to update object in db as failed to get a payment by uuid. Check if the payment exists in the database and try again"
}
```

#### Other responses


<br>

<br>

### 2.1.4) Actualizar un objeto Payment según su uuid
#### Request (PUT) | Code snippet
``` postman
curl --location --request PUT 'http://localhost:4000/dev/v1/payments/d5d58c31-8c29-41d2-a2e0-88322cb0238d' \
--header 'x-api-key: f98d8cd98h73s204e3456998ecl9427j' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' \
--header 'Content-Type: application/json' \
--data-raw '{
  "items": {
    "id": "test",
    "title": "test",
    "description": "test",
    "picture_url": "https://http2.mlstatic.com/resources/frontend/statics/growth-sellers-landings/device-mlb-point-i_medium@2x.png",
    "category_id": "electronics",
    "quantity": 1,
    "unit_price": 1000
  },
  "payer": {
    "id": "12",
    "first_name": "Test",
    "last_name": "Test"
  },
  "shipments": {
    "receiver_address": {
      "zip_code": "B16-2231FG",
      "state_name": "Rio de Janeiro",
      "city_name": "Buzios",
      "street_name": "Av das Nacoes Unidas",
      "street_number": 3003
    }
  },
  "description": "Payment for product",
  "external_reference": "MP0001",
  "payment_method_id": "visa",
  "token": "ff8080814c11e237014c1ff593b57b4d",
  "transaction_amount": 58.8
}'
```


#### Response (200 OK)
``` postman
{
    "message": {
        "externalReference": "MP0001",
        "paymentMethodId": "visa",
        "transactionAmount": 58.8,
        "description": "Payment for product",
        "items": {
            "quantity": 1,
            "picture_url": "https://http2.mlstatic.com/resources/frontend/statics/growth-sellers-landings/device-mlb-point-i_medium@2x.png",
            "category_id": "electronics",
            "description": "test",
            "id": "test",
            "title": "test",
            "unit_price": 1000
        },
        "payer": {
            "first_name": "Test",
            "last_name": "Test",
            "id": "12"
        },
        "shipments": {
            "receiver_address": {
                "street_number": 3003,
                "city_name": "Rio de Janeiro",
                "state_name": "Buzios",
                "zip_code": "B16-2231FG",
                "street_name": "Buzios"
            }
        },
        "uuid": "d5d58c31-8c29-41d2-a2e0-88322cb0238d",
        "token": "ff8080814c11e237014c1ff593b57b4d"
    }
}
```

#### Response (400 Bad Request)
``` postman
{
    "message": "Bad request, check missing or malformed headers"
}
```


#### Response (401 Unauthorized)
``` postman
{
    "message": "Not authenticated, check x_api_key and Authorization"
}
```

#### Response (500 Internal Server Error)
``` postman
{
    "message": "Bad request, unable to update object in db as failed to get a payment by uuid. Check if the payment exists in the database and try again"
}
```

#### Other responses

<br>

<br>

### 2.1.5) Eliminar un objeto Payment según su uuid
#### Request (DELETE) | Code snippet
``` postman
curl --location --request DELETE 'http://localhost:4000/dev/v1/payments/d5d58c31-8c29-41d2-a2e0-88322cb0238d' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' \
--header 'x-api-key: f98d8cd98h73s204e3456998ecl9427j' \
--header 'Content-Type: application/json'
```

#### Response (200 ok)
``` postman
{
    "message": "Successfully removed payment based on uuid d5d58c31-8c29-41d2-a2e0-88322cb0238d"
}
```


#### Response (400 Bad Request)
``` postman
{
    "message": "Bad request, check missing or malformed headers"
}
```


#### Response (401 Unauthorized)
``` postman
{
    "message": "Not authenticated, check x_api_key and Authorization"
}
```

#### Response (500 Internal Server Error)
``` postman
{
    "message": "Unable to delete payment based on uuid d5d58c31-8S29-41d2-a2e0-88322cb0238d"
}
```

#### Other responses

<br>

</details>

<br>


## Sección 3) Prueba de funcionalidad y Referencias. 


### 3.0) Prueba de funcionalidad [🔝](#índice-) 

<details>
  <summary>Ver</summary>
<br>

#### Tipos de Operaciones | [Ver](https://www.youtube.com/playlist?list=PLCl11UFjHurBIy51oB_CZa46KSF1cWn9W)
![Index app](./doc/assets/playlist.png)

</details>


### 3.1) Referencias [🔝](#índice-)

<details>
  <summary>Ver</summary>
 <br>

#### Herramientas 
 * [Herramienta de Diseño AWS app.diagrams.net](https://app.diagrams.net/?splash=0&libs=aws4)
 * [Formateo y validador online json format](https://jsonformatter.org/)

#### Api Gateway
 * [Api gateway documentation](https://www.serverless.com/guides/amazon-api-gateway)
 * [Api gateway serverless yml definition](https://dev.to/leventov/enable-cors-with-custom-headers-for-an-aws-lambda-function-behind-api-gateway-in-serverless-framework-3702)
 * [Api Gateway Template Example](https://github.com/SeptiyanAndika/serverless-custom-authorizer/blob/master/index.js)
 * [Buenas Prácticas Api-Gateway](https://docs.aws.amazon.com/whitepapers/latest/best-practices-api-gateway-private-apis-integration/rest-api.html)
 * [Creación de Api-keys personalizadas](https://towardsaws.com/protect-your-apis-by-creating-api-keys-using-serverless-framework-fe662ad37447)

 #### Librerías
 * [Validación de campos](https://www.npmjs.com/package/node-input-validator)

<br>

</details>
