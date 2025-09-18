🌐 CrowdGoal

CrowdGoal es una **dApp de crowdfunding Web3** construida sobre la red **Chiliz (EVM compatible)**.  
Permite a los usuarios crear y financiar proyectos descentralizados, con garantía de reembolsos automáticos si no se cumple el objetivo o la fecha límite.  
La plataforma retiene un **3% de comisión** sobre campañas exitosas.

---

## ✨ Características

- 📦 **Crowdfunding descentralizado**: fondos custodiados en contratos inteligentes.
- 🔒 **Seguridad garantizada**: devolución automática si no se alcanza la meta.
- 🌍 **Frontend-driven**: arquitectura sin backend tradicional, solo blockchain + IPFS.
- 🖼️ **Metadatos en IPFS**: descripciones, imágenes y documentos de proyectos se almacenan en sistemas descentralizados.
- 📊 **UI dinámica**: tarjetas estilo Urbanitae con progreso de recaudación, estado y deadline.

---

## 🏗️ Arquitectura

monorepo/
│── contracts/ # Contratos inteligentes (Hardhat)
│── frontend/ # Frontend (Next.js + Tailwind)
│── shared/abis/ # ABIs exportadas de Hardhat para el frontend

### Flujo de datos

1. Los contratos gestionan la lógica crítica:
   - Objetivo, deadline, recaudación, refunds y distribución.
2. El contrato guarda un `metadataURI` → apunta a un JSON en **IPFS** con datos visuales (título, descripción, imagen, docs).
3. El frontend escucha eventos → combina datos **on-chain** (goal, recaudado, estado) con metadata de **IPFS** → renderiza las tarjetas de proyectos.

---

## 🛠️ Stack Tecnológico

- **Blockchain & Smart Contracts**

  - [Hardhat](https://hardhat.org/) (compilación, tests, deployment)
  - Solidity (contratos en Chiliz EVM)

- **Frontend**

  - [Next.js](https://nextjs.org/) (React SSR/SPA híbrido)
  - [Tailwind CSS](https://tailwindcss.com/) (UI rápida y responsive)
  - [Wagmi](https://wagmi.sh/) + [viem](https://viem.sh/) (interacción con contratos)

- **Infraestructura**
  - [IPFS](https://ipfs.io/) (almacenamiento descentralizado de metadata e imágenes)
  - [The Graph](https://thegraph.com/) (opcional para indexado rápido de eventos)
  - GitHub Actions (CI/CD)

---

## 🚀 Instalación

Clonar el repo:

````bash
git clone https://github.com/tuusuario/crowdgoal.git
cd crowdgoal

Instalar dependencias:

```bash
npm install
````

Iniciar el frontend:

```bash
npm run dev
```

---

## 🧑‍💻 Contribuir

¡Las contribuciones son bienvenidas! Abre un issue o PR en GitHub para sugerir mejoras, reportar bugs o proponer nuevas funcionalidades.

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT.

---

## 📬 Contacto

Para dudas, soporte o colaboraciones, puedes abrir un issue en GitHub o escribir a [imansilladerqui@hotmail.com](mailto:imansilladerqui@hotmail.com).
