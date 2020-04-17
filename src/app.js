const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const id = uuid();

  const repository = {
    id,
    url,
    title,
    techs,
    likes: 0
  };

  repositories.push(repository);

  const data = repositories.find(repository => repository.id === id);

  return response.json(data);  
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const data = request.body; 

  const url = null;
  const title = null;
  const techs = null;
  const likes = null;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex < 0){
    return response.status(400).json({ error: "Repository not found" });
  }

  const repository = {
    id,
    url: data.url === undefined ? repositories[repositoryIndex].url : data.url,
    title: data.title === undefined ? repositories[repositoryIndex].title : data.title,
    techs: data.techs === undefined ? repositories[repositoryIndex].techs : data.techs,
    likes: data.likes === undefined ? repositories[repositoryIndex].likes : data.likes
  }

  repositories[repositoryIndex] = repository;

  if(data.url === undefined && data.title === undefined && data.techs === undefined && data.likes !== undefined){
    return response.json({ likes: 0 });
  }

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex < 0){
    return response.status(400).json({ error: "Repository not found" });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex < 0){
    return response.status(400).json({ error: "Repository not found" });
  }

  const { url, title, techs, likes } = repositories[repositoryIndex];

  const repository = {
    id,
    url,
    title,
    techs,
    likes: likes + 1
  }

  repositories[repositoryIndex] = repository;

  return response.json({
    likes: repositories[repositoryIndex].likes
  });
});

module.exports = app;
