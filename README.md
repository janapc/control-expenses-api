<div align="center">
  <h1>Control Expenses API</h1>
  <img alt="Last commit" src="https://img.shields.io/github/last-commit/janapc/control-expenses-api"/>
  <img alt="Language top" src="https://img.shields.io/github/languages/top/janapc/control-expenses-api"/>
  <img alt="Repo size" src="https://img.shields.io/github/repo-size/janapc/control-expenses-api"/>
  <img alt="CI Janapc Unit" src="https://github.com/janapc/control-expenses-api/actions/workflows/tests-unit.yml/badge.svg"/>
</div>
<div align="center">
  <a href="#description-writing_hand">Description</a> &#8226
  <a href="#installation-package">Installation</a> &#8226
  <a href="#technologies-gear">Technologies</a>
</div>

## Description :writing_hand: :

This project is based on a challenge of [Alura](https://www.alura.com.br/). An API that is a manager spent.

Utilizing the concept of Repository Pattern to that the code is less dependent and more alterables to library externals.

---

## Installation :package: :

To run the project use the steps below:

- create a file *.env* with a variable SECRET_JWT that is used in JWT.

If you have Docker installed in your machine:
```sh
## docker-compose
docker-compose up --build -d
```
or with nodejs:
```sh
## install dependences
$ npm i

## run in development
$ npm run dev
```

This application run in port **3000**.

Collection with all routes configuration just import in postman: *control-expenses-api.postman_collection.json*

---

## Technologies :gear: :

- nodejs
- typescript
- typeorm
- jest
- docker

---

<br>
<span align="center">

Made by Janapc 🤘 [Get in touch!](https://www.linkedin.com/in/janaina-pedrina/)

</span>